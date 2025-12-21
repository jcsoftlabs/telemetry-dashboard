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

        // Import autoTable - this extends jsPDF prototype
        await import('jspdf-autotable');

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

        // Convert complex data to simple key-value pairs for table display
        const convertToTableData = (obj: any, parentKey = ''): Array<{ key: string, value: string }> => {
            const result: Array<{ key: string, value: string }> = [];

            const formatValue = (val: any): string => {
                if (val === null || val === undefined) return 'N/A';
                if (typeof val === 'boolean') return val ? 'Oui' : 'Non';
                if (typeof val === 'number') return val.toFixed(2);
                if (val instanceof Date) return val.toLocaleDateString('fr-FR');
                if (Array.isArray(val)) {
                    if (val.length === 0) return 'Aucun';
                    if (typeof val[0] === 'object') return `${val.length} éléments`;
                    return val.slice(0, 3).join(', ') + (val.length > 3 ? '...' : '');
                }
                if (typeof val === 'object') return JSON.stringify(val);
                return String(val);
            };

            for (const key in obj) {
                if (!obj.hasOwnProperty(key)) continue;

                const value = obj[key];
                const fullKey = parentKey ? `${parentKey}.${key}` : key;

                if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                    // Recursively process nested objects
                    const nested = convertToTableData(value, fullKey);
                    result.push(...nested);
                } else {
                    // Add as key-value pair
                    result.push({
                        key: fullKey,
                        value: formatValue(value)
                    });
                }
            }

            return result;
        };

        // Convert data to table format
        const tableData = convertToTableData(data);

        if (tableData.length === 0) {
            alert('Aucune donnée à afficher dans le rapport');
            return;
        }

        // Prepare table data with two columns: Métrique and Valeur
        const headers = ['Métrique', 'Valeur'];
        const rows = tableData.map(item => [item.key, item.value]);

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
