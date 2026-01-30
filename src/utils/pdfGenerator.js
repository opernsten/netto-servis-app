import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <--- Importujeme to jako funkci 'autoTable'
import { formatDate } from './dateUtils';

export const generateServicePDF = (job) => {
  try {
    const doc = new jsPDF();

    // --- HLAVIČKA ---
    doc.setFontSize(22);
    doc.text('SERVISNÍ PROTOKOL', 105, 20, null, 'center');

    doc.setFontSize(10);
    doc.text('Netto Servis s.r.o.', 105, 27, null, 'center');
    doc.line(20, 32, 190, 32);

    // --- INFO O ZAKÁZCE ---
    doc.setFontSize(12);
    doc.text(`Číslo zakázky: ${job.job_number || '-'}`, 20, 45);
    doc.text(`Datum výjezdu: ${formatDate(job.scheduled_date)}`, 20, 52);
    
    if (job.completed_at) {
      doc.text(`Datum uzavření: ${formatDate(job.completed_at)}`, 20, 59);
    }

    // --- INFO O ZÁKAZNÍKOVI ---
    doc.text('Zákazník:', 120, 45);
    doc.setFontSize(10);
    doc.text(job.customers?.name || 'Neznámý zákazník', 120, 52);
    doc.text(job.customers?.address || '', 120, 57);
    
    // --- POPIS ZÁVADY ---
    doc.setFontSize(12);
    doc.text('Zadání / Popis závady:', 20, 75);
    doc.setFontSize(10);
    
    const description = job.description || 'Bez popisu';
    const splitDescription = doc.splitTextToSize(description, 170);
    doc.text(splitDescription, 20, 82);

    let yPosition = 82 + (splitDescription.length * 5) + 10;

    // --- TABULKA STROJŮ ---
    const tableRows = (job.machines || []).map(machine => [
      machine.name || '-',
      machine.serial_number || '-',
      machine.report || 'Bez záznamu',
      `${machine.machine_work_hours || 0} h`
    ]);

    // --- ZMĚNA: Voláme funkci autoTable a 'doc' jí posíláme jako první parametr ---
    autoTable(doc, {
      startY: yPosition,
      head: [['Stroj', 'S/N', 'Provedená práce', 'Čas']],
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

    // Získání pozice po tabulce (musíme použít lastAutoTable z objektu doc)
    let finalY = doc.lastAutoTable.finalY + 15;

    // --- SOUČTY ---
    const totalMachineHours = (job.machines || []).reduce((acc, m) => acc + Number(m.machine_work_hours || 0), 0);
    
    doc.setFontSize(11);
    doc.text(`Celkový čas na strojích: ${totalMachineHours} hod`, 20, finalY);
    doc.text(`Cestovní čas: ${job.travel_hours || 0} hod`, 20, finalY + 7);
    
    // Závěr servisu
    if (job.work_description) {
      finalY += 15;
      doc.setFontSize(12);
      doc.text('Celkový závěr servisu:', 20, finalY);
      doc.setFontSize(10);
      const splitConclusion = doc.splitTextToSize(job.work_description, 170);
      doc.text(splitConclusion, 20, finalY + 7);
      finalY += (splitConclusion.length * 5);
    }

    // --- PODPISY ---
    finalY += 30;
    
    if (finalY > 270) {
      doc.addPage();
      finalY = 40;
    }

    doc.setLineWidth(0.5);
    doc.line(20, finalY, 80, finalY);
    doc.line(120, finalY, 180, finalY);

    doc.setFontSize(10);
    doc.text('Podpis technika', 20, finalY + 5);
    doc.text('Podpis zákazníka', 120, finalY + 5);

    // 3. Uložení PDF
    doc.save(`Protokol_${job.job_number || 'servis'}.pdf`);

  } catch (error) {
    console.error("CHYBA PDF:", error);
    alert("Chyba při generování PDF: " + error.message);
  }
};