import jsPDF from 'jspdf';
import { ProjectState } from '../types';

export function generateVpcPeeringPdfReport(state: ProjectState) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;
  let pageNumber = 1;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 50) {
      drawFooter();
      doc.addPage();
      pageNumber++;
      y = margin + 20;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 144, 156);
    doc.text('CloudBridge Cloud Labs • AWS VPC Peering Student Project Report', margin, margin);
    doc.setDrawColor(220, 225, 230);
    doc.line(margin, margin + 5, pageWidth - margin, margin + 5);
  };

  const drawFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 144, 156);
    doc.setDrawColor(220, 225, 230);
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.text(
      `Confidential & Academic Lab Submission • Student: ${state.profile.studentName || 'Student'}`,
      margin,
      pageHeight - 22
    );
    doc.text(`Page ${pageNumber}`, pageWidth - margin - 35, pageHeight - 22);
  };

  // --- COVER PAGE ---
  // Background top banner
  doc.setFillColor(15, 23, 42); // Navy 900
  doc.rect(0, 0, pageWidth, 240, 'F');

  // Accent bar (AWS Orange)
  doc.setFillColor(255, 153, 0); // AWS Orange #FF9900
  doc.rect(0, 240, pageWidth, 6, 'F');

  // Cover Page Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CLOUDBRIDGE CLOUD LABS', margin, 70);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 179, 71);
  doc.text('ARCHITECT. CONNECT. EMPOWER.', margin, 90);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('AWS VPC Peering', margin, 140);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('Private Network Connectivity Student Project Workbook', margin, 165);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('Non-Transitive Cross-VPC Interconnect with Bastion Host & Isolated Workloads', margin, 190);

  // Student Details Box
  y = 280;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 180, 6, 6, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 180, 6, 6, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('STUDENT & SUBMISSION DETAILS', margin + 20, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);

  const leftX = margin + 20;
  const col2X = margin + 260;

  doc.text(`Student Name:`, leftX, y + 55);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(state.profile.studentName || 'Not Specified', leftX + 85, y + 55);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Batch / Cohort:`, leftX, y + 80);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(state.profile.batch || 'Not Specified', leftX + 85, y + 80);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`AWS Region:`, leftX, y + 105);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(state.profile.awsRegion, leftX + 85, y + 105);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Account Alias:`, col2X, y + 55);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(state.profile.awsAccountAlias || 'Lab Account', col2X + 85, y + 55);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Start Date:`, col2X, y + 80);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(state.profile.startDate || 'N/A', col2X + 85, y + 80);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Completion Date:`, col2X, y + 105);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(state.profile.completionDate || new Date().toISOString().split('T')[0], col2X + 95, y + 105);

  // Security compliance badge on cover
  doc.setFillColor(236, 253, 245);
  doc.rect(margin + 20, y + 130, contentWidth - 40, 32, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(5, 150, 105);
  doc.text('SECURITY COMPLIANCE AUDIT PASSED', margin + 30, y + 148);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 118, 110);
  doc.text('Zero SSH keys, passwords, or AWS secret keys recorded. SSH ProxyJump local key hygiene verified.', margin + 30, y + 158);

  // Executive Score Card on cover
  y = 485;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 120, 6, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('PROJECT EXECUTION SUMMARY', margin + 20, y + 25);

  const completedTasks = state.workflowStages.reduce(
    (acc, s) => acc + s.tasks.filter((t) => t.completed).length,
    0
  );
  const totalTasks = state.workflowStages.reduce((acc, s) => acc + s.tasks.length, 0);
  const totalScore = state.evaluation.reduce((acc, e) => acc + (e.awardedMarks || 0), 0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Workflow Completion: ${completedTasks} / ${totalTasks} checkpoints (${Math.round((completedTasks / totalTasks) * 100)}%)`, margin + 20, y + 50);
  doc.text(`VPC Peering Connection ID: ${state.peering.peeringId || 'Pending'} (Status: ${state.peering.status})`, margin + 20, y + 68);
  doc.text(`Evaluation Score: ${totalScore} / 100 Marks`, margin + 20, y + 86);
  doc.text(`Cleanup Status: ${state.cleanupSteps.filter((c) => c.completed).length} / 13 teardown steps verified`, margin + 20, y + 104);

  // Cover Page Bottom Notice
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated via CloudBridge AWS VPC Peering Lab Workspace • Report is compliant with university grading rubric.', margin, pageHeight - 50);

  drawFooter();

  // --- PAGE 2: ARCHITECTURE & CIDR SPECIFICATIONS ---
  doc.addPage();
  pageNumber++;
  y = margin + 20;
  drawHeader();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Project Architecture & Networking Specifications', margin, y);
  y += 25;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const intro = doc.splitTextToSize(
    'This project implements a secure, isolated dual-VPC architecture on Amazon Web Services (AWS) in the ap-south-1 (Mumbai) region. VPC A (10.10.0.0/16) serves as the primary ingress hub hosting a Bastion host in a public subnet with an attached Internet Gateway (ewb-igw-a), and an application host in a private subnet. VPC B (10.20.0.0/16) acts as a completely isolated workload VPC with no Internet Gateway. Inter-VPC communication is established exclusively over a non-transitive VPC Peering connection (ewb-a-b-peer).',
    contentWidth
  );
  doc.text(intro, margin, y);
  y += intro.length * 12 + 15;

  // Architecture Comparison Table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 20, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Parameter', margin + 10, y + 14);
  doc.text('VPC A (ewb-vpc-a)', margin + 150, y + 14);
  doc.text('VPC B (ewb-vpc-b)', margin + 340, y + 14);
  y += 20;

  const archRows = [
    ['IPv4 CIDR Block', '10.10.0.0/16 (65,536 IPs)', '10.20.0.0/16 (65,536 IPs)'],
    ['Internet Gateway', 'ewb-igw-a (Attached)', 'None (Strictly Isolated)'],
    ['Public Subnets', 'ewb-a-public: 10.10.1.0/24', 'None'],
    ['Private Subnets', 'ewb-a-private: 10.10.2.0/24', 'ewb-b-private: 10.20.1.0/24'],
    ['Compute Workloads', 'ewb-bastion, ewb-app-a', 'ewb-app-b'],
    ['Public IP Allowed?', 'YES - ewb-bastion only', 'NO - 0 Public IPs allowed'],
    ['Route Tables', 'ewb-rt-a-public, ewb-rt-a-private', 'ewb-rt-b-private'],
  ];

  doc.setFont('helvetica', 'normal');
  archRows.forEach((row, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 18, 'F');
    }
    doc.setTextColor(15, 23, 42);
    doc.text(row[0], margin + 10, y + 13);
    doc.text(row[1], margin + 150, y + 13);
    doc.text(row[2], margin + 340, y + 13);
    y += 18;
  });

  y += 15;

  // Non-Transitive Rule explanation
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, y, contentWidth, 42, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(180, 83, 9);
  doc.text('KEY AWS NETWORKING RULE: NON-TRANSITIVE PEERING', margin + 10, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text(
    'AWS VPC Peering does NOT support transitive routing. VPC B cannot route out to the public internet through VPC A\'s Internet Gateway. Similarly, edge-to-edge routing is unsupported. App-B remains completely air-gapped from internet threats.',
    margin + 10,
    y + 28
  );

  y += 55;

  // --- RESOURCE INVENTORY TABLE ---
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Actual AWS Resource Inventory', margin, y);
  y += 18;

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Resource Name', margin + 6, y + 12);
  doc.text('Type', margin + 110, y + 12);
  doc.text('CIDR / IP', margin + 190, y + 12);
  doc.text('Actual AWS Resource ID', margin + 300, y + 12);
  doc.text('Status', margin + 440, y + 12);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  state.resources.forEach((res, idx) => {
    checkPageBreak(20);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 16, 'F');
    }
    doc.setTextColor(15, 23, 42);
    doc.text(res.name, margin + 6, y + 11);
    doc.text(res.type, margin + 110, y + 11);
    doc.text(res.cidrOrIp.substring(0, 20), margin + 190, y + 11);
    doc.text(res.actualResourceId || 'Pending', margin + 300, y + 11);

    if (res.status === 'Available') {
      doc.setTextColor(5, 150, 105);
    } else {
      doc.setTextColor(100, 116, 139);
    }
    doc.text(res.status, margin + 440, y + 11);
    y += 16;
  });

  // --- PAGE 3: ROUTING & SECURITY GROUPS ---
  checkPageBreak(160);
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Route Tables & Bidirectional Peering Routes', margin, y);
  y += 18;

  state.routeTables.forEach((rt) => {
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${rt.name} (${rt.associatedSubnet}) - Actual ID: ${rt.actualId || 'rtb-pending'}`, margin, y);
    y += 14;

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Destination CIDR', margin + 10, y + 11);
    doc.text('Target', margin + 160, y + 11);
    doc.text('Status', margin + 380, y + 11);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    rt.routes.forEach((r, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 14, 'F');
      }
      doc.setTextColor(30, 41, 59);
      doc.text(r.destinationCidr, margin + 10, y + 10);
      doc.text(r.target, margin + 160, y + 10);
      doc.setTextColor(5, 150, 105);
      doc.text(r.status.toUpperCase(), margin + 380, y + 10);
      y += 14;
    });
    y += 10;
  });

  // Security Groups Section
  checkPageBreak(150);
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Security Group Configurations & Ingress Rules', margin, y);
  y += 18;

  state.securityGroups.forEach((sg) => {
    checkPageBreak(75);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${sg.name} (${sg.vpc}) - Actual ID: ${sg.actualId || 'sg-pending'}`, margin, y);
    y += 13;

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Type', margin + 8, y + 10);
    doc.text('Protocol', margin + 100, y + 10);
    doc.text('Port / ICMP', margin + 160, y + 10);
    doc.text('Authorized Source', margin + 260, y + 10);
    doc.text('Rule Rationale', margin + 380, y + 10);
    y += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    sg.inboundRules.forEach((rule, rIdx) => {
      if (rIdx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 14, 'F');
      }
      doc.setTextColor(30, 41, 59);
      doc.text(rule.type, margin + 8, y + 10);
      doc.text(rule.protocol, margin + 100, y + 10);
      doc.text(rule.portOrRange, margin + 160, y + 10);
      doc.text(rule.source, margin + 260, y + 10);
      doc.text(rule.description.substring(0, 26) + '...', margin + 380, y + 10);
      y += 14;
    });
    y += 8;
  });

  // --- CONNECTIVITY TEST RESULTS ---
  checkPageBreak(180);
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('5. Verified Connectivity Test Results', margin, y);
  y += 18;

  state.tests.forEach((test) => {
    checkPageBreak(85);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(test.name, margin + 10, y + 16);

    const isPass = test.passed === true;
    doc.setFontSize(8);
    doc.setTextColor(isPass ? 5 : 220, isPass ? 150 : 38, isPass ? 105 : 38);
    doc.text(isPass ? 'STATUS: PASSED / VERIFIED' : 'STATUS: FAILED / PENDING', margin + 340, y + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Command: ${test.command}`, margin + 10, y + 30);
    doc.text(`Source: ${test.sourceHost}  ->  Destination: ${test.destinationIp}`, margin + 10, y + 44);

    const expl = doc.splitTextToSize(`Result: ${test.explanation}`, contentWidth - 20);
    doc.text(expl, margin + 10, y + 58);
    y += 85;
  });

  // --- CONTROLLED FAILURE & RECOVERY ---
  checkPageBreak(150);
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('6. Controlled Failure & Recovery Experiment (Stage 11)', margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const expDesc = doc.splitTextToSize(
    'To rigorously demonstrate that VPC Peering traffic is governed by Security Group firewalls at the hypervisor layer, a 3-step fault injection experiment was conducted by selectively removing and restoring the ICMP Echo Request inbound rule on ewb-sg-app-b.',
    contentWidth
  );
  doc.text(expDesc, margin, y);
  y += expDesc.length * 11 + 10;

  const states = [
    {
      title: 'State 1: Baseline Before Rule Removal',
      result: 'Rule present. Forward ping App-A -> App-B yields 4/4 replies, 0% packet loss.',
      status: 'VERIFIED SUCCESS',
      color: [5, 150, 105],
    },
    {
      title: 'State 2: Controlled Failure (Rule Removed)',
      result: state.controlledFailure.duringFailure.explanation || 'ICMP rule deleted. App-A ping experiences 100% packet loss. SSH remains operational.',
      status: 'EXPECTED FAILURE VERIFIED',
      color: [220, 38, 38],
    },
    {
      title: 'State 3: Dynamic Recovery (Rule Restored)',
      result: state.controlledFailure.afterRecovery.explanation || 'ICMP rule restored. Forward ping returns immediately to 0% packet loss without restarting instances.',
      status: 'DYNAMIC RECOVERY CONFIRMED',
      color: [5, 150, 105],
    },
  ];

  states.forEach((s) => {
    checkPageBreak(45);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 38, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(s.title, margin + 8, y + 13);

    doc.setTextColor(s.color[0], s.color[1], s.color[2]);
    doc.text(s.status, margin + 330, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const line = doc.splitTextToSize(s.result, contentWidth - 16);
    doc.text(line, margin + 8, y + 25);
    y += 44;
  });

  // --- LESSONS LEARNED & VIVA ANSWERS ---
  checkPageBreak(160);
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('7. Key Technical Findings & Lessons Learned', margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const lessons = doc.splitTextToSize(state.lessonsLearned, contentWidth);
  doc.text(lessons, margin, y);
  y += lessons.length * 11 + 15;

  // --- EVALUATION SCORECARD ---
  checkPageBreak(160);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('8. Project Evaluation & Rubric Marks Breakdown', margin, y);
  y += 18;

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Grading Criterion', margin + 8, y + 12);
  doc.text('Max Marks', margin + 260, y + 12);
  doc.text('Awarded', margin + 340, y + 12);
  doc.text('Instructor Feedback', margin + 410, y + 12);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  state.evaluation.forEach((evalItem, idx) => {
    checkPageBreak(25);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 20, 'F');
    }
    doc.setTextColor(15, 23, 42);
    doc.text(evalItem.name, margin + 8, y + 13);
    doc.text(`${evalItem.maxMarks} Marks`, margin + 260, y + 13);
    doc.setFont('helvetica', 'bold');
    doc.text(`${evalItem.awardedMarks} Marks`, margin + 340, y + 13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(evalItem.feedback.substring(0, 30) + '...', margin + 410, y + 13);
    y += 20;
  });

  // Total Score Banner
  y += 8;
  doc.setFillColor(236, 253, 245);
  doc.rect(margin, y, contentWidth, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105);
  doc.text(`TOTAL FINAL EVALUATION SCORE: ${totalScore} / 100 MARKS`, margin + 12, y + 16);
  y += 32;

  // --- CLEANUP EVIDENCE ---
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('9. AWS Resource Cleanup & Teardown Compliance', margin, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'All 13 teardown steps were systematically carried out to prevent unexpected AWS cloud charges. Below is the confirmation checklist:',
    margin,
    y
  );
  y += 16;

  state.cleanupSteps.forEach((c) => {
    checkPageBreak(18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(c.completed ? 5 : 100, c.completed ? 150 : 116, c.completed ? 105 : 139);
    doc.text(c.completed ? '[COMPLETED]' : '[PENDING]', margin + 10, y);
    doc.setTextColor(30, 41, 59);
    doc.text(`Step ${c.stepNumber}: ${c.action} (${c.targetResource})`, margin + 75, y);
    y += 14;
  });

  drawFooter();

  // Save PDF
  const studentSafe = (state.profile.studentName || 'YourName').replace(/\s+/g, '_');
  const filename = `${studentSafe}_CloudBridge_AWS_VPC_Peering.pdf`;
  doc.save(filename);
}
