import jsPDF from "jspdf";
import { Simulation } from "../api/simulation.api";

function currency(value: string | number) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function optionLabel(option: string) {
  return option.replace("FINANCING_", "Financiamento ").replace("CONSORTIUM", "Consórcio");
}

export function generatePdf(simulation: Simulation) {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function addLine(size: number) {
    y += size;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(16, 185, 129);
  doc.text("Casa Certa", margin, y);
  addLine(8);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text("Simulador Comparativo de Financiamento e Consorcio", margin, y);
  addLine(6);

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  addLine(10);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Resultado da Simulacao", margin, y);
  addLine(8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Imovel de ${currency(simulation.propertyValue)} com entrada de ${currency(simulation.downPayment)}`,
    margin,
    y,
  );
  addLine(4);
  doc.text(
    `Renda mensal: ${currency(simulation.monthlyIncome)} | Prazo: ${simulation.termMonths} meses | Urgencia: ${simulation.urgency}`,
    margin,
    y,
  );
  addLine(4);
  doc.text(`Data: ${new Date(simulation.createdAt).toLocaleDateString("pt-BR")}`, margin, y);
  addLine(10);

  const rec = simulation.recommendation;

  doc.setFillColor(236, 253, 245);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 95, 70);
  doc.text(`Recomendacao: ${optionLabel(rec.recommendedOption)}`, margin + 6, y + 8);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(21, 128, 61);
  const reasonLines = doc.splitTextToSize(rec.reason, contentWidth - 12);
  doc.text(reasonLines.slice(0, 2), margin + 6, y + 14);
  addLine(26);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Comparativo", margin, y);
  addLine(8);

  const sac = simulation.financingResults.find((r) => r.financingType === "SAC")!;
  const price = simulation.financingResults.find((r) => r.financingType === "PRICE")!;
  const consortium = simulation.consortiumResult;

  const colWidth = contentWidth / 3;
  const tableX = margin;

  doc.setFillColor(243, 244, 246);
  doc.rect(tableX, y, contentWidth, 8, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(55, 65, 81);
  doc.text("Financiamento SAC", tableX + 4, y + 5.5);
  doc.text("Financiamento PRICE", tableX + colWidth + 4, y + 5.5);
  doc.text("Consorcio", tableX + colWidth * 2 + 4, y + 5.5);
  addLine(10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);

  const rows = [
    ["Primeira parcela", currency(sac.firstInstallment), "Parcela fixa", currency(price.firstInstallment), "Parcela mensal", currency(consortium.monthlyPayment)],
    ["Ultima parcela", currency(sac.lastInstallment), "Ultima parcela", currency(price.lastInstallment), "Taxa adm. total", currency(consortium.adminFeeTotal)],
    ["Total de juros", currency(sac.totalInterest), "Total de juros", currency(price.totalInterest), "Contemplacao est.", `${consortium.estimatedContemplation} meses`],
  ];

  for (const row of rows) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(row[0], tableX + 4, y + 4);
    doc.text(row[2], tableX + colWidth + 4, y + 4);
    doc.text(row[4], tableX + colWidth * 2 + 4, y + 4);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text(row[1], tableX + 4, y + 9);
    doc.text(row[3], tableX + colWidth + 4, y + 9);
    doc.text(row[5], tableX + colWidth * 2 + 4, y + 9);
    addLine(13);
  }

  doc.setDrawColor(209, 213, 219);
  doc.line(tableX, y, tableX + contentWidth, y);
  addLine(3);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(55, 65, 81);
  doc.text("Custo total", tableX + 4, y + 4);
  doc.text(currency(sac.totalCost), tableX + 4, y + 10);
  doc.text("Custo total", tableX + colWidth + 4, y + 4);
  doc.text(currency(price.totalCost), tableX + colWidth + 4, y + 10);
  doc.text("Custo total", tableX + colWidth * 2 + 4, y + 4);
  doc.text(currency(consortium.totalCost), tableX + colWidth * 2 + 4, y + 10);
  addLine(16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Pontuacao", margin, y);
  addLine(6);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text(`Financiamento: ${Number(rec.scoreFinancing).toFixed(1)} pts`, margin, y);
  doc.text(`Consorcio: ${Number(rec.scoreConsortium).toFixed(1)} pts`, margin + 60, y);
  doc.text(`Economia estimada: ${currency(rec.savingsEstimate)}`, margin + 120, y);
  addLine(10);

  if (rec.aiReason) {
    checkPageBreak(60);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Analise do Consultor", margin, y);
    addLine(7);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    const aiLines = doc.splitTextToSize(rec.aiReason, contentWidth);
    for (const line of aiLines) {
      checkPageBreak(5);
      doc.text(line, margin, y);
      addLine(4.2);
    }
    addLine(6);
  }

  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text(
    "Documento gerado pelo Casa Certa - Simulador Comparativo de Financiamento e Consorcio Imobiliario",
    margin,
    doc.internal.pageSize.getHeight() - 10,
  );

  doc.save(`casa-certa-simulacao-${new Date().toISOString().slice(0, 10)}.pdf`);
}
