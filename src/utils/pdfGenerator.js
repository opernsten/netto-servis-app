import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <--- ZMĚNA IMPORTU
import { calculateDuration } from './dateUtils';
// Import loga
import { COMPANY_LOGO_BASE64 } from '../assets/logoData'; 

export const generateServicePDF = (job) => {
  const doc = new jsPDF();

  // --- 1. LOGO A HLAVIČKA ---
  try {
    if (COMPANY_LOGO_BASE64) {
      doc.addImage(COMPANY_LOGO_BASE64, 'PNG', 15, 10, 40, 15);
    } else {
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("SERVISNÍ FIRMA", 15, 20);
    }
  } catch (e) {
    console.warn("Logo chyba:", e);
    doc.setFontSize(22);
    doc.text("SERVISNÍ FIRMA", 15, 20);
  }

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("SERVISNÍ PROTOKOL", 140, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Číslo zakázky: ${job.job_number}`, 140, 27);
  const dateStr = new Date(job.completed_at || job.created_at).toLocaleDateString('cs-CZ');
  doc.text(`Datum: ${dateStr}`, 140, 32);

  doc.setDrawColor(200, 200, 200);
  doc.line(15, 40, 195, 40);

  // --- 2. ZÁKAZNÍK A TÝM ---
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Zákazník / Místo servisu:", 15, 50);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(job.customers?.name || 'Neznámý zákazník', 15, 56);
  const addressLines = doc.splitTextToSize(job.customers?.address || '', 80);
  doc.text(addressLines, 15, 61);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Realizační tým:", 110, 50);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Technici: ${job.technician_names || '-'}`, 110, 56);
  doc.text(`Kouč zakázky: ${job.coach || '-'}`, 110, 61);

  // --- 3. TABULKA ---
  const tableRows = job.machines?.map(m => {
    const partsText = m.parts && m.parts.length > 0 
      ? m.parts.map(p => `• ${p.description} (${p.quantity}ks)`).join('\n')
      : '';

    return [
      `${m.name}\nS/N: ${m.serial_number}`,
      m.report || 'Bez popisu.',
      partsText
    ];
  });

  // ZMĚNA: Voláme funkci autoTable(doc, options)
  autoTable(doc, {
    startY: 80,
    head: [['Stroj', 'Popis závady a opravy', 'Spotřebovaný materiál']],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'left'
    },
    styles: { 
        fontSize: 9, 
        cellPadding: 4, 
        overflow: 'linebreak',
        textColor: 50
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 50 }
    }
  });

  // ZMĚNA: Bezpečné získání pozice Y
  let finalY = (doc.lastAutoTable?.finalY || 80) + 10;

  // --- 4. SOUHRN ---
  if (finalY > 250) {
      doc.addPage();
      finalY = 20;
  }

  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(230, 230, 230);
  doc.rect(15, finalY, 180, 55, 'FD');

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Vyúčtování času a dopravy", 20, finalY + 10);

  const workDuration = calculateDuration(job.work_start_time, job.work_end_time);
  const travelDuration = calculateDuration(job.travel_start_time, job.travel_end_time);

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  doc.text(`Práce na místě:`, 20, finalY + 20);
  doc.setFont(undefined, 'bold');
  doc.text(`${job.work_start_time || '--'} - ${job.work_end_time || '--'}`, 60, finalY + 20);
  doc.setFont(undefined, 'normal');
  doc.text(`(Celkem: ${workDuration || '0h'})`, 95, finalY + 20);

  doc.text(`Cestování:`, 20, finalY + 28);
  doc.setFont(undefined, 'bold');
  doc.text(`${job.travel_start_time || '--'} - ${job.travel_end_time || '--'}`, 60, finalY + 28);
  doc.setFont(undefined, 'normal');
  doc.text(`(Celkem: ${travelDuration || '0h'})`, 95, finalY + 28);

  doc.text(`Vozidlo:`, 20, finalY + 36);
  doc.setFont(undefined, 'bold');
  doc.text(`${job.vehicle || '-'}`, 60, finalY + 36);

  doc.setFont(undefined, 'normal');
  doc.text("Závěrečná poznámka:", 20, finalY + 45);
  
  const noteLines = doc.splitTextToSize(job.final_note || 'Bez poznámky.', 170);
  doc.setFont(undefined, 'italic');
  doc.text(noteLines, 20, finalY + 50);

  // --- 5. PATIČKA ---
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont(undefined, 'normal');
  doc.text("Vygenerováno systémem ServisApp", 15, pageHeight - 10);
  
  doc.setDrawColor(0, 0, 0);
  doc.line(120, pageHeight - 25, 190, pageHeight - 25);
  doc.text("Podpis technika / zákazníka", 120, pageHeight - 20);

  doc.save(`Servisni_protokol_${job.job_number}.pdf`);
};