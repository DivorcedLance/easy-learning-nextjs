import { mailOptions, transporter } from '@/lib/nodemailer';
import { NextRequest, NextResponse } from 'next/server';

const CONTACT_MESSAGE_FIELDS = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
};

const generateEmailContent = (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) => {
    const stringData = Object.entries(data).reduce(
        (str, [key, val]) =>
            (str += `${CONTACT_MESSAGE_FIELDS[key as keyof typeof CONTACT_MESSAGE_FIELDS]}: \n${val} \n \n`),
        ""
    );
    
    const htmlData = Object.entries(data).reduce((str, [key, val]) => {
        return (str += `<h3 class="form-heading" align="left">${CONTACT_MESSAGE_FIELDS[key as keyof typeof CONTACT_MESSAGE_FIELDS]}</h3><p class="form-answer" align="left">${val}</p>`);
    }, "");
    
 
    return {
        text: stringData,
        html: `<!DOCTYPE html><html> <head> <title></title> <meta charset="utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <style type="text/css"> body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table{border-collapse: collapse !important;}body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}@media screen and (max-width: 525px){.wrapper{width: 100% !important; max-width: 100% !important;}.responsive-table{width: 100% !important;}.padding{padding: 10px 5% 15px 5% !important;}.section-padding{padding: 0 15px 50px 15px !important;}}.form-container{margin-bottom: 24px; padding: 20px; border: 1px dashed #ccc;}.form-heading{color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 400; text-align: left; line-height: 20px; font-size: 18px; margin: 0 0 8px; padding: 0;}.form-answer{color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 300; text-align: left; line-height: 20px; font-size: 16px; margin: 0 0 24px; padding: 0;}div[style*="margin: 16px 0;"]{margin: 0 !important;}</style> </head> <body style="margin: 0 !important; padding: 0 !important; background: #fff"> <div style=" display: none; font-size: 1px; color: #fefefe; line-height: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; " ></div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 10px 15px 30px 15px" class="section-padding" > <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px" class="responsive-table" > <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0" > <tr> <td style=" padding: 0 0 0 0; font-size: 16px; line-height: 25px; color: #232323; " class="padding message-content" > <h2>Bienvenido(a) a Easy Learning!</h2> <div class="form-container">${htmlData}</div></td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table> </body></html>`,
    };
};


export const GET = async (req: NextRequest) => {
    return NextResponse.json({ message: 'Hello from the API!' });
};

//hacer un post que me vuelva "Posteado: {mensaje}"
export const POST = async (req: NextRequest) => {
    const body = await req.json();
    if (!body.email || !body.firstName || !body.lastName) {
        return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }
    console.log(body);
    try {
        await transporter.sendMail({
            ...mailOptions,
            ...generateEmailContent(body),
            to: body.email,
            subject: '✅ Cuenta registrada',
        });
        return NextResponse.json({ message: `Posteado: ${body.email}` }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error al enviar el mensaje' }, { status: 400 });
    }
};

//ejemplo de url para el post
