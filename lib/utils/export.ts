'use client';

import Papa from 'papaparse';

/**
 * Export data to CSV format using papaparse
 */
export function exportToCSV(data: any[], filename: string) {
    try {
        if (!data || data.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        // Convert to CSV using papaparse
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
 * Export data to PDF format with Ministry header
 */
export async function exportToPDF(title: string, data: any[], filename: string) {
    try {
        if (!data || data.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        // Dynamic imports
        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Add Ministry header
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

        // Add generation date
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

        // Flatten complex data structures for table display
        const flattenData = (obj: any, prefix = ''): any => {
            const flattened: any = {};

            for (const key in obj) {
                const value = obj[key];
                const newKey = prefix ? `${prefix}.${key}` : key;

                if (value === null || value === undefined) {
                    flattened[newKey] = 'N/A';
                } else if (Array.isArray(value)) {
                    // For arrays, just show count or first few items
                    if (value.length === 0) {
                        flattened[newKey] = '0 éléments';
                    } else if (typeof value[0] === 'object') {
                        flattened[newKey] = `${value.length} éléments`;
                    } else {
                        flattened[newKey] = value.slice(0, 3).join(', ');
                    }
                } else if (typeof value === 'object' && !(value instanceof Date)) {
                    // Recursively flatten nested objects
                    Object.assign(flattened, flattenData(value, newKey));
                } else {
                    flattened[newKey] = value;
                }
            }

            return flattened;
        };

        // Convert data to flat array
        let tableData: any[];
        if (Array.isArray(data)) {
            tableData = data.map(item => flattenData(item));
        } else {
            // Single object - convert to array with one item
            tableData = [flattenData(data)];
        }

        if (tableData.length === 0 || Object.keys(tableData[0]).length === 0) {
            alert('Aucune donnée à afficher dans le rapport');
            return;
        }

        // Prepare table data
        const headers = Object.keys(tableData[0]);
        const rows = tableData.map(item => headers.map(header => {
            const value = item[header];
            // Format values for display
            if (typeof value === 'number') {
                return value.toFixed(2);
            }
            return String(value);
        }));

        // Add table using autoTable
        (doc as any).autoTable({
            head: [headers],
            body: rows,
            startY: 55,
            theme: 'striped',
            headStyles: {
                fillColor: [41, 128, 185], // Blue
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

        // Add footer with page numbers
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
