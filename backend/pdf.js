const PDFDocument = require('pdfkit');

class PDFGenerator {
    generateOrderPDF(order, orderItems, user) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const chunks = [];
                
                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                
                // Заголовок документа
                doc.fontSize(20).text('Чек заказа CosmoShop', { align: 'center' });
                doc.moveDown();
                
                // Информация о заказе
                doc.fontSize(12);
                doc.text(`Номер заказа: #${order.id}`);
                doc.text(`Дата: ${new Date(order.created_at).toLocaleDateString()}`);
                doc.text(`Покупатель: ${user.name} (${user.email})`);
                doc.moveDown();
                
                // Таблица товаров
                doc.text('Состав заказа:');
                doc.moveDown();
                
                let yPosition = doc.y;
                const tableTop = yPosition;
                
                // Заголовки таблицы
                doc.text('Товар', 50, yPosition);
                doc.text('Кол-во', 300, yPosition);
                doc.text('Цена', 350, yPosition);
                doc.text('Сумма', 420, yPosition);
                
                yPosition += 20;
                doc.moveTo(50, yPosition).lineTo(500, yPosition).stroke();
                
                // Строки с товарами
                orderItems.forEach(item => {
                    yPosition += 20;
                    doc.text(item.name, 50, yPosition, { width: 250 });
                    doc.text(item.quantity.toString(), 300, yPosition);
                    doc.text(`${item.price} руб.`, 350, yPosition);
                    doc.text(`${item.price * item.quantity} руб.`, 420, yPosition);
                });
                
                yPosition += 30;
                doc.moveTo(50, yPosition).lineTo(500, yPosition).stroke();
                
                // Итоговая сумма
                yPosition += 20;
                doc.text(`Итого: ${order.total_amount} руб.`, 350, yPosition, { align: 'right' });
                
                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new PDFGenerator();