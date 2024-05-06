import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ['GET', 'POST'],
		credentials: true,
	})
);

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Working Well',
	});
});

app.post('/send-email', async (req, res) => {
	try {
		// Form data: filled by the user
		const { sender_name, sender_email, sender_company_name, sender_message } =
			req.body;

		if ((!sender_name, !sender_email, !sender_company_name, !sender_message))
			return res.status(400).json({
				success: false,
				message: 'Required fields empty!',
			});

		// Email Template
		const html = `<p>${sender_message}</p>`;

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_MAIL_USER,
				pass: process.env.SMTP_MAIL_PASSWORD,
			},
		});

		const info = await transporter.sendMail({
			from: sender_email,
			to: process.env.TO_EMAIL,
			subject: `${sender_company_name}: ${sender_name}`,
			html,
		});

		console.log('Message Sent: ', info.messageId);

		return res.status(200).json({
			success: true,
			message: 'Email Sent',
		});
	} catch (error) {
		console.log(error.message);

		res.status(400).json({
			success: false,
			message: 'Email Not Sent!',
		});
	}
});

app.listen(PORT, () => {
	console.log(`Listening on PORT: http://localhost:${PORT}`);
});
