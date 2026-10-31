// CIDR calculation and overlap detection utility for AWS VPC networking

export interface ParsedCidr {
  cidr: string;
  ip: string;
  prefix: number;
  ipNumeric: number;
  maskNumeric: number;
  startIpNumeric: number;
  endIpNumeric: number;
  startIp: string;
  endIp: string;
  totalIps: number;
  awsUsableIps: number;
  netmask: string;
}

export function ipToNumeric(ip: string): number {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return 0;
  return (
    ((parseInt(parts[0], 10) & 0xff) << 24) |
    ((parseInt(parts[1], 10) & 0xff) << 16) |
    ((parseInt(parts[2], 10) & 0xff) << 8) |
    (parseInt(parts[3], 10) & 0xff)
  ) >>> 0;
}

export function numericToIp(num: number): string {
  return [
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff
  ].join('.');
}

export function parseCidr(cidr: string): ParsedCidr | null {
  const parts = cidr.trim().split('/');
  if (parts.length !== 2) return null;

  const ip = parts[0].trim();
  const prefix = parseInt(parts[1].trim(), 10);

  if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;

  const ipNum = ipToNumeric(ip);
  const maskNumeric = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const startIpNumeric = (ipNum & maskNumeric) >>> 0;
  const totalIps = prefix === 32 ? 1 : Math.pow(2, 32 - prefix);
  const endIpNumeric = (startIpNumeric + totalIps - 1) >>> 0;

  // AWS reserves 5 IPs in each subnet:
  // .0 (Network address)
  // .1 (Reserved by AWS for the VPC router)
  // .2 (Reserved by AWS for DNS)
  // .3 (Reserved by AWS for future use)
  // .255 (Network broadcast address - AWS does not support broadcast, but reserves it)
  const awsUsableIps = prefix >= 29 ? Math.max(0, totalIps - 5) : Math.max(0, totalIps - 5);

  return {
    cidr: `${ip}/${prefix}`,
    ip,
    prefix,
    ipNumeric: ipNum,
    maskNumeric,
    startIpNumeric,
    endIpNumeric,
    startIp: numericToIp(startIpNumeric),
    endIp: numericToIp(endIpNumeric),
    totalIps,
    awsUsableIps,
    netmask: numericToIp(maskNumeric)
  };
}

export function checkCidrOverlap(cidr1: string, cidr2: string): {
  overlaps: boolean;
  explanation: string;
  parsed1: ParsedCidr | null;
  parsed2: ParsedCidr | null;
} {
  const p1 = parseCidr(cidr1);
  const p2 = parseCidr(cidr2);

  if (!p1 || !p2) {
    return {
      overlaps: false,
      explanation: 'Invalid CIDR format. Must be e.g. 10.10.0.0/16',
      parsed1: p1,
      parsed2: p2
    };
  }

  // Two ranges [A, B] and [C, D] overlap if max(A, C) <= min(B, D)
  const maxStart = Math.max(p1.startIpNumeric, p2.startIpNumeric);
  const minEnd = Math.min(p1.endIpNumeric, p2.endIpNumeric);

  const overlaps = maxStart <= minEnd;

  let explanation = '';
  if (overlaps) {
    explanation = `CRITICAL: Overlap detected! Range ${p1.startIp} - ${p1.endIp} intersects with ${p2.startIp} - ${p2.endIp}. In AWS, VPCs with overlapping CIDRs CANNOT be peered because routers cannot uniquely route IP packets.`;
  } else {
    explanation = `Valid: No overlap detected. ${cidr1} (${p1.startIp} - ${p1.endIp}) and ${cidr2} (${p2.startIp} - ${p2.endIp}) are distinct, allowing unambiguous routing across the VPC peering connection.`;
  }

  return {
    overlaps,
    explanation,
    parsed1: p1,
    parsed2: p2
  };
}
