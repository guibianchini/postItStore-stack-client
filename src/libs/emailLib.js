import emailjs from 'emailjs-com';

export function email(message, to_email) {
  let serviceID = "service_6uc40qt";
  let templateID = "template_sh8mohr";
  let templateParams = {
    message: message.replaceAll("\n","; "),
    to_email,
  };
  let userID = "user_JM5LE7kmqzcgkVgsO06jW";

  emailjs.send(serviceID, templateID, templateParams, userID).then(
    function (response) {
      console.log("Email enviado!", response.status, response.text);
    },
    function (error) {
      console.log("Email falhou :(", error);
    }
  );
}
