// import mailGunPkg from "mailgun-js";
const mailGunPkg = require("mailgun-js");

const apiKey = process.env.MAILGUN_API_KEY;
const domain = "www.letsendorse.com";
const mailgun = mailGunPkg({ apiKey, domain });

const sendEmail = (
    toEmail,
    body,
    subject,
    fromEmail = "LetsEndorse <support@letsendorse.com>",
    fromName = "LetsEndorse",
    replyEmail = `${fromName} <support@letsendorse.com>`,
    ccAddress
) => {
    if (!toEmail || toEmail.trim() === "") {
        console.log("toEmail not given");
        return false;
    }

    //   fromEmail = !fromEmail ? `${fromName} <support@letsendorse.com>`
    //   : `${fromName} <${fromEmail}>`;

    const data = {
        from: fromEmail,
        to: toEmail,
        subject,
        html: body,
    };

    data["h:Reply-To"] = !replyEmail ? "support@letsendorse.com" : replyEmail;

    if (ccAddress && ccAddress.length) {
        let cc = "";
        for (let i = 0; i < ccAddress.length; i += 1) {
            cc += ccAddress[i];
            if (i !== ccAddress.length - 1) {
                cc += ",";
            }
        }
        data.cc = cc;
    }

    mailgun.messages().send(data, (error, _resp) => {
        if (!error) {
            console.log("Email sent!", toEmail);
            return true;
        }
        console.error("Error in sending email", error);
        return false;
    });
};

module.exports = sendEmail;
