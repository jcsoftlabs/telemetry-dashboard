// Utility functions for exporting data

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Export data to PDF format using jsPDF
 */
export async function exportToPDF(title: string, data: any[], filename: string) {
    // Dynamic import to reduce bundle size
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString('fr-FR')}`, 14, 28);

    // Get headers and rows
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => row[header]));

    // Add table
    (doc as any).autoTable({
        head: [headers],
        body: rows,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue
    });

    // Save
    doc.save(`${filename}.pdf`);
}
