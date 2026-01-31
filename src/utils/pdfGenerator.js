import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './dateUtils';

// Pomocná funkce: Odstraní háčky a čárky (aby se text nerozsypal)
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const generateServicePDF = (job) => {
  try {
    const doc = new jsPDF();

    // --- HLAVIČKA (HEADER) ---
    doc.setFontSize(22);
    doc.text('SERVICE REPORT', 105, 20, null, 'center');

    doc.setFontSize(10);
    doc.text('Netto Servis s.r.o.', 105, 27, null, 'center');
    doc.line(20, 32, 190, 32);

    // --- INFO O ZAKÁZCE (JOB INFO) ---
    doc.setFontSize(12);
    doc.text(`Job Number: ${removeAccents(job.job_number) || '-'}`, 20, 45);
    doc.text(`Date: ${formatDate(job.scheduled_date)}`, 20, 52);
    
    if (job.completed_at) {
      doc.text(`Completed: ${formatDate(job.completed_at)}`, 20, 59);
    }

    // --- ZÁKAZNÍK (CUSTOMER) ---
    doc.text('Customer:', 120, 45);
    doc.setFontSize(10);
    doc.text(removeAccents(job.customers?.name || 'Unknown Customer'), 120, 52);
    doc.text(removeAccents(job.customers?.address || ''), 120, 57);
    
    // --- POPIS (DESCRIPTION) ---
    doc.setFontSize(12);
    doc.text('Issue Description:', 20, 75);
    doc.setFontSize(10);
    
    const description = removeAccents(job.description || 'No description');
    const splitDescription = doc.splitTextToSize(description, 170);
    doc.text(splitDescription, 20, 82);

    let yPosition = 82 + (splitDescription.length * 5) + 10;

    // --- TABULKA STROJŮ (MACHINES TABLE) ---
    const tableRows = (job.machines || []).map(machine => [
      removeAccents(machine.name || '-'),
      removeAccents(machine.serial_number || '-'),
      removeAccents(machine.report || 'No record'),
      `${machine.machine_work_hours || 0} h`
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Machine', 'S/N', 'Work Report', 'Time']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 20, halign: 'right' }
      }
    });

    let finalY = doc.lastAutoTable.finalY + 15;

    // --- SOUČTY (TOTALS) ---
    const totalMachineHours = (job.machines || []).reduce((acc, m) => acc + Number(m.machine_work_hours || 0), 0);
    
    doc.setFontSize(11);
    doc.text(`Total Machine Time: ${totalMachineHours} h`, 20, finalY);
    doc.text(`Travel Time: ${job.travel_hours || 0} h`, 20, finalY + 7);
    
    // Závěr (Conclusion)
    if (job.work_description) {
      finalY += 15;
      doc.setFontSize(12);
      doc.text('Conclusion / Notes:', 20, finalY);
      doc.setFontSize(10);
      const splitConclusion = doc.splitTextToSize(removeAccents(job.work_description), 170);
      doc.text(splitConclusion, 20, finalY + 7);
      finalY += (splitConclusion.length * 5);
    }

    // --- PODPISY (SIGNATURES) ---
    finalY += 30;
    
    if (finalY > 270) {
      doc.addPage();
      finalY = 40;
    }

    doc.setLineWidth(0.5);
    doc.line(20, finalY, 80, finalY);
    doc.line(120, finalY, 180, finalY);

    doc.setFontSize(10);
    doc.text('Technician Signature', 20, finalY + 5);
    doc.text('Customer Signature', 120, finalY + 5);

    // 3. Uložení PDF
    doc.save(`Service_Report_${job.job_number || 'export'}.pdf`);

  } catch (error) {
    console.error("PDF ERROR:", error);
    alert("Error generating PDF: " + error.message);
  }
};