'use client';

import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 */
export function exportToCSV(data: any[], filename: string) {
    try {
        if (!data || data.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        // Convert to CSV
        const csv = Papa.unparse(data);

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`✅ CSV exported: ${filename}.csv`);
    } catch (error) {
        console.error('❌ Error exporting CSV:', error);
        alert('Erreur lors de l\'export CSV');
    }
}

/**
 * Export data to PDF file with formatted table
 * @param data - Array of objects to export
 * @param title - Title of the PDF document
 * @param filename - Name of the file (without extension)
 */
export function exportToPDF(data: any[], title: string, filename: string) {
    try {
        if (!data || data.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        const doc = new jsPDF();

        // Add header
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('RÉPUBLIQUE D\'HAÏTI', 105, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.text('Ministère du Tourisme', 105, 22, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Plateforme de Surveillance', 105, 28, { align: 'center' });

        // Add title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(title, 105, 40, { align: 'center' });

        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        const date = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(`Généré le ${date}`, 105, 46, { align: 'center' });

        // Prepare table data
        const headers = Object.keys(data[0]);
        const rows = data.map(item => headers.map(header => item[header]));

        // Add table
        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 55,
            theme: 'striped',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        // Add footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Page ${i} sur ${pageCount}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        doc.save(`${filename}.pdf`);

        console.log(`✅ PDF exported: ${filename}.pdf`);
    } catch (error) {
        console.error('❌ Error exporting PDF:', error);
        alert('Erreur lors de l\'export PDF');
    }
}

/**
 * Format telemetry data for export
 * @param data - Raw telemetry data
 * @param type - Type of data (sessions, errors, events, etc.)
 */
export function formatDataForExport(data: any, type: string): any[] {
    if (!data) return [];

    switch (type) {
        case 'sessions':
            return data.sessions?.map((session: any) => ({
                'ID Session': session.id,
                'Utilisateur': session.userId || 'Anonyme',
                'Début': new Date(session.startedAt).toLocaleString('fr-FR'),
                'Fin': session.endedAt ? new Date(session.endedAt).toLocaleString('fr-FR') : 'En cours',
                'Durée (min)': session.duration ? Math.round(session.duration / 60) : '-',
                'Pages vues': session.pageviewsCount || 0,
                'Événements': session.eventsCount || 0,
                'Pays': session.country || '-',
                'Ville': session.city || '-',
                'Appareil': session.deviceType || '-',
                'OS': session.os || '-',
                'Navigateur': session.browser || '-'
            })) || [];

        case 'errors':
            return data.byType?.map((error: any) => ({
                'Type d\'erreur': error.errorType,
                'Nombre': error.count,
                'Sévérité': error.severity || '-',
                'Dernière occurrence': error.lastOccurrence ? new Date(error.lastOccurrence).toLocaleString('fr-FR') : '-'
            })) || [];

        case 'events':
            return data.byType?.map((event: any) => ({
                'Type d\'événement': event.eventType,
                'Nombre': event.count,
                'Pourcentage': data.total > 0 ? `${((event.count / data.total) * 100).toFixed(1)}%` : '0%'
            })) || [];

        case 'devices':
            return data.byDeviceType?.map((device: any) => ({
                'Type d\'appareil': device.deviceType,
                'Nombre': device.count,
                'Pourcentage': `${device.percentage}%`
            })) || [];

        case 'geo':
            return data.byCountry?.map((country: any) => ({
                'Pays': country.country,
                'Sessions': country.sessionCount,
                'Utilisateurs': country.userCount,
                'Pages vues': country.pageviewCount
            })) || [];

        default:
            // Generic format - convert object to array
            if (Array.isArray(data)) {
                return data;
            }
            return [data];
    }
}

/**
 * Generate filename with timestamp
 * @param baseName - Base name for the file
 */
export function generateFilename(baseName: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${baseName}-${timestamp}`;
}
