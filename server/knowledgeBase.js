// ── IT Support Knowledge Base ─────────────────────────────────────────────
// Source: Common_IT_Support_Queries.docx — 62 exact entries
// Each entry: id, query, category, response, keywords for matching

const KB = [
  { id:1,  q:"I forgot my password",                                       cat:"Password Issue",    col:"blue",
    r:"You can reset your password using the company self-service password reset portal. After resetting, wait 2–3 minutes before trying to log in again. If you still cannot access your account, I can create a support ticket for the IT team.",
    keys:["forgot password","forgot my password","password reset","cant login","cannot login","locked out","password expired","lost password","forgotten password","reset password"] },

  { id:2,  q:"VPN is not connecting",                                       cat:"Network Issue",     col:"green",
    r:"Please first check whether your internet connection is stable. Then verify that your VPN username, password, and MFA code are correct. Try disconnecting and reconnecting to the VPN client. If the issue continues, restarting your device may also help.",
    keys:["vpn is not connecting","vpn not connecting","vpn wont connect","vpn failed","cant connect vpn","cannot connect vpn","vpn down","vpn not working","vpn error","vpn connection"] },

  { id:3,  q:"Outlook is not opening",                                      cat:"Email Issue",       col:"purple",
    r:"Outlook may not open due to corrupted cache files or pending updates. Please restart your computer first and try opening Outlook again. If it still fails, run Outlook in safe mode or contact IT support for profile repair assistance.",
    keys:["outlook is not opening","outlook not opening","outlook wont open","outlook crash","outlook not working","cant open outlook","outlook fails to open","outlook not starting"] },

  { id:4,  q:"Internet is very slow today",                                 cat:"Network Issue",     col:"green",
    r:"Slow internet can happen due to network congestion, background downloads, or VPN traffic. Please disconnect unnecessary devices or applications using the network and restart your router if you are working remotely.",
    keys:["internet is very slow","internet slow","slow internet","slow network","bad connection","network slow","internet speed slow","internet sluggish","connection slow"] },

  { id:5,  q:"I cannot print documents",                                    cat:"Printer Issue",     col:"teal",
    r:"Please make sure the printer is powered on and connected to the company network. Also check whether the printer is selected as the default printer. If the issue continues, try clearing the print queue and printing again.",
    keys:["i cannot print","cannot print","cant print","printer not working","printing issue","print problem","print failed","unable to print","wont print"] },

  { id:6,  q:"Teams keep crashing during meetings",                         cat:"Software Issue",    col:"amber",
    r:"This issue is often caused by corrupted cache files or outdated software. Please close Teams completely, clear the Teams cache, and reopen the application. Updating Teams to the latest version may also solve the problem.",
    keys:["teams keep crashing","teams crashing","teams crash","teams not working","microsoft teams crashing","teams freeze","teams keeps crashing","teams closing","teams stops working"] },

  { id:7,  q:"My laptop battery drains quickly",                            cat:"Hardware Issue",    col:"amber",
    r:"Battery drain may happen when multiple applications are running in the background or screen brightness is too high. Please reduce brightness, close unused applications, and enable battery saver mode. If the battery still drains unusually fast, the hardware may need inspection.",
    keys:["battery drains quickly","laptop battery drains","battery drain","battery draining","battery dies fast","battery low quickly","battery depletes fast","battery drains fast"] },

  { id:8,  q:"Cannot access shared drive",                                  cat:"Access Request",    col:"purple",
    r:"You may not currently have permission to access this shared drive, or the VPN connection may be disconnected. Please reconnect to the VPN and try again. If access is still denied, I can submit an access request ticket on your behalf.",
    keys:["cannot access shared drive","cant access shared drive","shared drive access","network drive access","shared folder denied","drive access denied","shared drive not accessible"] },

  { id:9,  q:"My monitor is blank",                                         cat:"Hardware Issue",    col:"amber",
    r:"Please check whether the monitor power cable and display cable are securely connected. Try restarting your computer and reconnecting the monitor. If available, test using another cable or monitor to identify the issue.",
    keys:["monitor is blank","monitor blank","black screen","monitor not working","screen blank","display blank","no display","screen black","monitor no signal","blank monitor"] },

  { id:10, q:"I received a suspicious email",                               cat:"Security Alert",    col:"red", escalate:true,
    r:"Please do not click on any links or attachments in the email. Suspicious emails may contain phishing attempts or malware. Forward the email to the cybersecurity team immediately and delete it from your inbox afterward.",
    keys:["suspicious email","received a suspicious email","phishing email","spam email","malicious email","fake email","scam email","suspicious message","phishing link"] },

  { id:11, q:"The printer is offline",                                      cat:"Printer Issue",     col:"teal",
    r:"This usually happens when the printer loses network connectivity. Please restart the printer and ensure it is connected to the office network. You can also try removing and re-adding the printer on your computer.",
    keys:["printer is offline","printer offline","printer not found","printer disconnected","printer not detected","printer shows offline"] },

  { id:12, q:"Unable to connect to Wi-Fi",                                  cat:"Network Issue",     col:"green",
    r:"Please confirm that Wi-Fi is enabled on your device and that you are entering the correct password. Restarting the Wi-Fi adapter or your laptop may also help restore the connection.",
    keys:["unable to connect to wifi","cant connect to wifi","no wifi","wifi not working","wifi problem","wifi issue","no internet wifi","cannot connect to wifi","wi-fi not connecting"] },

  { id:13, q:"Outlook keeps asking for password",                           cat:"Email Issue",       col:"purple",
    r:"This issue may occur due to incorrect saved credentials or synchronization problems. Please remove saved Outlook credentials from Credential Manager and log in again using your company account.",
    keys:["outlook keeps asking for password","outlook asking for password","outlook password prompt","outlook credential loop","outlook login loop","outlook keeps asking"] },

  { id:14, q:"Laptop is overheating",                                       cat:"Hardware Issue",    col:"amber",
    r:"Overheating can occur when air vents are blocked or heavy applications are running continuously. Please place the laptop on a flat surface with proper airflow and close unnecessary programs. If overheating continues, the cooling fan may need servicing.",
    keys:["laptop is overheating","laptop overheating","laptop hot","overheating","laptop heating","getting hot","too hot","laptop warm","computer overheating","laptop overheat"] },

  { id:15, q:"Cannot hear audio in meeting calls",                          cat:"Software Issue",    col:"amber",
    r:"Please check whether the correct speaker or headset is selected in Teams audio settings. Also confirm that your device volume is not muted. Rejoining the meeting after reconnecting your audio device may solve the issue.",
    keys:["cannot hear audio","cant hear audio","no audio in meeting","audio not working in call","sound problem meeting","no sound in teams","muted in meeting","audio issue in call"] },

  { id:16, q:"Blue screen error after update",                              cat:"Hardware Issue",    col:"red",  escalate:true,
    r:"A recent system or driver update may have caused compatibility issues. Please restart your device in safe mode and uninstall the latest update if possible. If the problem continues, IT support may need to reinstall or repair Windows.",
    keys:["blue screen error","blue screen after update","bsod","blue screen of death","system crash after update","windows crash","bluescreen","stop error","blue screen"] },

  { id:17, q:"My keyboard keys are not responding",                         cat:"Hardware Issue",    col:"amber",
    r:"Please restart your computer and reconnect the keyboard if it is external. You can also test whether the issue occurs in another application. If multiple keys are still unresponsive, the keyboard hardware may require replacement.",
    keys:["keyboard keys not responding","keyboard not working","keys not responding","keyboard problem","keyboard broken","keys stuck","keyboard dead","keyboard unresponsive"] },

  { id:18, q:"The VPN disconnects frequently",                              cat:"Network Issue",     col:"green",
    r:"Frequent VPN disconnections are usually caused by unstable internet connectivity or outdated VPN software. Please ensure your internet connection is stable and update the VPN client to the latest version.",
    keys:["vpn disconnects frequently","vpn keeps disconnecting","vpn unstable","vpn dropping","vpn drops","vpn frequent disconnect","vpn keeps dropping","vpn disconnects often"] },

  { id:19, q:"My webcam is not detected",                                   cat:"Hardware Issue",    col:"amber",
    r:"Please disconnect and reconnect the webcam, then restart the application using it. You should also check whether camera permissions are enabled in your system settings.",
    keys:["webcam is not detected","webcam not detected","camera not working","webcam issue","camera problem","webcam not found","camera not detected","webcam not showing"] },

  { id:20, q:"Unable to send emails",                                       cat:"Email Issue",       col:"purple",
    r:"Please verify your internet connection and ensure your mailbox storage is not full. If the problem continues, the mail server may be temporarily unavailable.",
    keys:["unable to send emails","cant send email","cannot send email","email not sending","sending email failed","emails not going out","outgoing mail not working"] },

  { id:21, q:"System is running very slowly",                               cat:"Performance Issue", col:"amber",
    r:"Slow system performance may be caused by low storage space, background applications, or pending updates. Please restart your computer and close unnecessary programs. Running a malware scan is also recommended.",
    keys:["system is running very slowly","system slow","computer slow","laptop slow","running slow","slow performance","sluggish computer","pc slow","very slow system"] },

  { id:22, q:"Shared printer is missing",                                   cat:"Printer Issue",     col:"teal",
    r:"The printer may have been disconnected from the network or removed after a system update. Please re-add the printer from the company printer portal or contact IT support for assistance.",
    keys:["shared printer is missing","printer missing","printer not showing","printer not listed","printer disappeared","shared printer gone","printer not visible"] },

  { id:23, q:"My laptop freezes randomly during work",                      cat:"Hardware Issue",    col:"red",  escalate:true,
    r:"Random freezing may occur due to insufficient memory, overheating, or software conflicts. Please save your work, restart the laptop, and check whether unnecessary applications are consuming high CPU or RAM usage. If the issue continues frequently, a hardware diagnostic may be required.",
    keys:["laptop freezes randomly","laptop freezes","computer freezes","freezing randomly","random freeze","laptop hangs","computer hangs","screen freezes","system freezes","keeps freezing"] },

  { id:24, q:"I cannot access the company intranet",                        cat:"Network Issue",     col:"green",
    r:"Please verify that you are connected to the company network or VPN. Clear your browser cache and try reopening the intranet page. If the website still does not load, the intranet server may be temporarily unavailable.",
    keys:["cannot access company intranet","cant access intranet","intranet not loading","company intranet down","internal portal not working","intranet unavailable"] },

  { id:25, q:"Laptop fan is making a loud noise",                           cat:"Hardware Issue",    col:"amber",
    r:"Loud fan noise may happen when the laptop is overheating or running heavy applications. Please close unnecessary programs and ensure the laptop vents are not blocked by dust or surfaces like beds or cushions.",
    keys:["fan is making loud noise","loud fan noise","fan making noise","fan spinning fast","laptop fan noise","noisy fan","fan very loud","laptop fan loud","cooling fan noise"] },

  { id:26, q:"The scanner is not detected by my computer",                  cat:"Hardware Issue",    col:"amber",
    r:"Please reconnect the scanner cable and restart both the scanner and your computer. You can also check Device Manager to confirm whether the scanner drivers are installed properly.",
    keys:["scanner not detected","scanner not detected by computer","scanner not working","scanner issue","scanner not found","scanner missing","scanner not recognized"] },

  { id:27, q:"System restart takes too long",                               cat:"Performance Issue", col:"amber",
    r:"Long restart times are often caused by background updates or unnecessary startup applications. Please allow pending updates to complete and disable unused startup programs from Task Manager.",
    keys:["system restart takes too long","restart takes too long","slow restart","restart slow","long restart time","slow boot","boot takes too long","slow startup"] },

  { id:28, q:"Need access to archived emails",                              cat:"Email Issue",       col:"purple", escalate:true,
    r:"Access to archived emails may require supervisor approval depending on company retention policies. I can create a request ticket for email archive retrieval.",
    keys:["need access to archived emails","archived emails","email archive access","access old emails","retrieve archived emails","email archive retrieval"] },

  { id:29, q:"My laptop touchpad stopped working",                          cat:"Hardware Issue",    col:"amber",
    r:"Please check whether the touchpad was accidentally disabled using the function keys on your keyboard. Restarting the laptop and updating touchpad drivers may also solve the issue.",
    keys:["touchpad stopped working","laptop touchpad not working","touchpad issue","trackpad not working","touchpad disabled","touchpad problem","touchpad not responding"] },

  { id:30, q:"VPN authentication failed",                                   cat:"Network Issue",     col:"green",
    r:"Authentication failure may occur because of incorrect credentials or expired passwords. Please verify your login information carefully and ensure your MFA code is entered correctly.",
    keys:["vpn authentication failed","vpn auth failed","vpn login failed","vpn credentials wrong","vpn wrong password","vpn mfa failed","vpn authentication error"] },

  { id:31, q:"Need administrator approval to access database server",       cat:"Access Request",    col:"purple", escalate:true,
    r:"Database access requires security and management approval due to the sensitive nature of company data. I can initiate the approval workflow for you.",
    keys:["administrator approval database","access database server","database server access","admin approval database","db access request","need database access"] },

  { id:32, q:"Cannot map network drive",                                    cat:"Network Issue",     col:"green",
    r:"Please verify that you are connected to the corporate VPN or office network. Then re-enter the shared drive path carefully when mapping the drive again.",
    keys:["cannot map network drive","cant map network drive","network drive mapping failed","map drive error","drive mapping not working","network drive not mapping"] },

  { id:33, q:"Received phishing SMS on company phone",                      cat:"Security Alert",    col:"red",  escalate:true,
    r:"Do not click on any links or respond to the message. Please report the SMS to the cybersecurity team immediately so they can investigate possible threats.",
    keys:["phishing sms","suspicious sms","suspicious text message","phishing text","spam sms","smishing","received phishing sms","suspicious text on phone"] },

  { id:34, q:"Need software upgrade approval",                              cat:"Software Request",  col:"teal", escalate:true,
    r:"Software upgrades may require compatibility checks with company systems before approval. I can create a request ticket and forward it to the IT software management team.",
    keys:["software upgrade approval","need software upgrade","software update request","upgrade approval","request software upgrade","software upgrade request"] },

  { id:35, q:"Need account disabled for resigned employees",                cat:"Account Management",col:"blue", escalate:true,
    r:"Offboarding requests require confirmation from HR or management. Once approved, the employee's email, VPN, and system access will be disabled securely.",
    keys:["disable account resigned","account disabled resigned","offboarding employee","resigned employee account","deactivate account","disable employee account","account termination"] },

  { id:36, q:"System storage is full",                                      cat:"Performance Issue", col:"amber",
    r:"Low storage space can affect system performance and updates. Please remove unnecessary files or move large files to approved cloud storage locations.",
    keys:["system storage is full","storage full","disk full","low storage","storage almost full","out of storage","storage issue","hard drive full","no disk space"] },

  { id:37, q:"Laptop screen flickers occasionally",                         cat:"Hardware Issue",    col:"amber",
    r:"Screen flickering may occur due to outdated display drivers or loose display connections. Please restart your laptop and install the latest graphics drivers.",
    keys:["screen flickers occasionally","screen flicker","screen flickering","display flicker","monitor flicker","flickering screen","screen blinks","laptop screen flickers"] },

  { id:38, q:"My system clock shows incorrect time",                        cat:"Software Issue",    col:"amber",
    r:"Incorrect system time can affect VPN, email, and authentication services. Please synchronize your system clock with the company time server from Windows settings.",
    keys:["system clock shows incorrect time","wrong time","incorrect time","system time wrong","clock wrong","time off","date wrong","system clock incorrect"] },

  { id:39, q:"Unable to open Excel files",                                  cat:"Software Issue",    col:"amber",
    r:"This issue may occur due to file corruption or Office installation problems. Please try opening another Excel file first and repair Microsoft Office if needed.",
    keys:["unable to open excel","excel not opening","excel crash","cant open excel","excel not working","excel file wont open","excel fails to open"] },

  { id:40, q:"I cannot connect my laptop to the projector in the meeting room", cat:"Hardware Issue", col:"amber",
    r:"Please make sure the HDMI or VGA cable is securely connected to both the laptop and projector. Press the display shortcut key on your keyboard and select Duplicate or Extend Display. Restarting the projector may also help detect the connection properly.",
    keys:["cannot connect laptop to projector","laptop to projector","projector not working","hdmi not working","display not detected projector","laptop projector connection"] },

  { id:41, q:"I accidentally deleted an important email",                   cat:"Email Issue",       col:"purple",
    r:"Deleted emails are usually moved to the Deleted Items or Recoverable Items folder temporarily. Please check those folders first. If the email cannot be found, I can create a recovery request for the email administration team.",
    keys:["accidentally deleted email","deleted important email","recover deleted email","missing email","email deleted accidentally","email recovery","lost email"] },

  { id:42, q:"I forgot my VPN password",                                    cat:"Password Issue",    col:"blue",
    r:"You can reset your VPN password through the company password management portal. After resetting, wait a few minutes before attempting to reconnect to the VPN service.",
    keys:["forgot vpn password","vpn password forgotten","forgot my vpn password","vpn password lost","reset vpn password","vpn password reset"] },

  { id:43, q:"Shared printer prints very slowly",                           cat:"Printer Issue",     col:"teal",
    r:"Slow printing may occur when multiple users are sending print jobs simultaneously. Please wait a few moments and try printing a smaller document to confirm whether the issue persists.",
    keys:["shared printer prints slowly","printer prints slowly","slow printing","print slowly","printer taking long","printing takes forever","slow printer"] },

  { id:44, q:"My email attachments are blocked",                            cat:"Email Issue",       col:"purple",
    r:"Certain file types may be restricted for security reasons to prevent malware or phishing attacks. Please compress the file into a ZIP format or use approved cloud-sharing services if permitted.",
    keys:["email attachments blocked","attachments are blocked","cant send attachment","blocked attachment","email attachment blocked","file blocked in email","attachment not allowed"] },

  { id:45, q:"Laptop battery is not charging",                              cat:"Hardware Issue",    col:"amber",
    r:"Please check whether the charger cable is connected securely and verify that the charging indicator light is active. If possible, test using another charger or power outlet to identify the issue.",
    keys:["laptop battery not charging","battery not charging","not charging","charger not working","laptop not charging","battery wont charge","charging issue","charger problem"] },

  { id:46, q:"My screen resolution suddenly changed",                       cat:"Hardware Issue",    col:"amber",
    r:"This may happen after a display driver update or external monitor connection. Please open display settings and select the recommended screen resolution for your device.",
    keys:["screen resolution changed","resolution suddenly changed","display resolution wrong","resolution changed","wrong resolution","screen resolution issue","resolution changed by itself"] },

  { id:47, q:"Outlook search cannot find recent emails",                    cat:"Email Issue",       col:"purple",
    r:"Outlook indexing may be incomplete or corrupted. Please rebuild the Outlook search index from the indexing options in Control Panel and restart Outlook afterward.",
    keys:["outlook search not working","outlook cant find emails","outlook search broken","outlook search cannot find","email search not working","cant find recent emails in outlook"] },

  { id:48, q:"My mouse cursor keeps freezing",                              cat:"Hardware Issue",    col:"amber",
    r:"Cursor freezing may happen because of low battery, USB connection issues, or system lag. Please reconnect the mouse, replace batteries if wireless, and restart your computer.",
    keys:["mouse cursor freezing","cursor keeps freezing","mouse not working","cursor stuck","mouse freezing","cursor problem","mouse stops","mouse lagging","cursor freezes"] },

  { id:49, q:"I cannot scan documents to email",                            cat:"Printer Issue",     col:"teal",
    r:"Please confirm that the scanner is connected to the network and that the configured email address is correct. Restarting the scanner may also resolve temporary connection problems.",
    keys:["cannot scan documents to email","scan to email not working","cant scan to email","scanner email not working","document scan to email","scan email issue"] },

  { id:50, q:"MFA notifications are not arriving on my phone",              cat:"Security Issue",    col:"red",
    r:"Please verify that your mobile device has internet connectivity and notifications enabled for the authenticator application. Restarting the app or resynchronizing your account may help.",
    keys:["mfa notifications not arriving","mfa not working","two factor not working","2fa not working","authenticator not working","mfa code not arriving","otp not arriving","verification code not coming"] },

  { id:51, q:"Company application shows Server Not Responding",             cat:"Software Issue",    col:"amber",
    r:"This message may indicate temporary server downtime or network instability. Please save your work if possible and try reconnecting after a few minutes.",
    keys:["server not responding","application server not responding","app shows server not responding","server down message","application not responding","server error message"] },

  { id:52, q:"Need permission to install a browser extension",              cat:"Software Request",  col:"teal", escalate:true,
    r:"Browser extensions may require security review before installation. Please provide the extension name and business purpose so the request can be reviewed by IT security.",
    keys:["permission to install browser extension","browser extension permission","install extension request","chrome extension install","firefox extension install","plugin install permission"] },

  { id:53, q:"My external hard drive is not detected",                      cat:"Hardware Issue",    col:"amber",
    r:"Please reconnect the drive using another USB port if available. You can also check Disk Management to see whether the drive appears but needs to be assigned a drive letter.",
    keys:["external hard drive not detected","external drive not detected","usb drive not detected","hard drive not showing","external hard drive not recognized","usb not detected"] },

  { id:54, q:"Teams chat messages are not syncing",                         cat:"Software Issue",    col:"amber",
    r:"Please sign out of Teams completely and sign back in again. Clearing the Teams cache may also restore synchronization for chats and notifications.",
    keys:["teams messages not syncing","teams not syncing","teams sync issue","teams chat not syncing","teams messages not loading","teams notifications not working"] },

  { id:55, q:"Need access to old project files",                            cat:"Access Request",    col:"purple", escalate:true,
    r:"Archived project files may require approval from the project owner or department manager. I can generate an access request ticket for retrieval.",
    keys:["access old project files","need old project files","archived project files","access past project","old project file access","retrieve project files"] },

  { id:56, q:"Unable to connect to office Wi-Fi after password change",     cat:"Network Issue",     col:"green",
    r:"Please forget the Wi-Fi network from your device settings and reconnect using the updated password. Restarting your device afterward may also help refresh network settings.",
    keys:["wifi after password change","wifi password changed","reconnect wifi new password","wifi not working after password","forget wifi reconnect","wifi disconnected after password change"] },

  { id:57, q:"The file server storage is full",                             cat:"Performance Issue", col:"amber",
    r:"File uploads and shared drive performance may be affected when server storage reaches capacity. Please remove unnecessary files or contact storage administration for additional allocation.",
    keys:["file server storage full","server storage full","file server full","shared drive storage full","server disk full","file server capacity"] },

  { id:58, q:"Unable to access Microsoft 365 apps",                        cat:"Software Issue",    col:"amber",
    r:"Please verify that your Microsoft 365 subscription is active and that you are logged in with the correct company account credentials.",
    keys:["cannot access microsoft 365","microsoft 365 not working","office 365 issue","m365 not working","office apps not opening","microsoft 365 access issue","365 not working"] },

  { id:59, q:"Need VPN access for a new employee",                          cat:"Account Management",col:"blue", escalate:true,
    r:"Please provide the employee's name, department, and joining date. VPN setup requires approval and account provisioning by the IT access management team.",
    keys:["vpn access new employee","new employee vpn","onboarding vpn","new staff vpn access","setup vpn new employee","new hire vpn","vpn for new staff"] },

  { id:60, q:"My laptop automatically restarts unexpectedly",               cat:"Hardware Issue",    col:"red",  escalate:true,
    r:"Unexpected restarts may occur because of overheating, system crashes, or hardware failures. Please save your work frequently and check whether recent updates or driver installations triggered the issue.",
    keys:["laptop restarts unexpectedly","laptop automatically restarts","unexpected restart","random restart","computer restarts itself","laptop keeps restarting","laptop restarts on its own"] },

  { id:61, q:"Need access to a confidential document repository",           cat:"Access Request",    col:"red",  escalate:true,
    r:"Access to confidential repositories requires approval from authorized management personnel. Your request can be escalated for security verification.",
    keys:["confidential document repository","access confidential documents","confidential file access","restricted document access","classified document access","secure document repository"] },

  { id:62, q:"Laptop storage fills up very quickly",                        cat:"Performance Issue", col:"amber",
    r:"Large temporary files, downloads, or cloud synchronization folders may be consuming storage space. Please review unused files and clear temporary storage regularly.",
    keys:["laptop storage fills up quickly","storage fills up fast","disk fills up quickly","storage keeps filling","laptop storage issue","disk space filling up","storage depletes quickly"] },

  { id:63, q:"Company Wi-Fi connects but internet does not work",            cat:"Network Issue",     col:"green",
    r:"Your device is connected to Wi-Fi but not the internet. Please restart the router and forget/reconnect to the SSID. If the issue persists, check DNS settings or contact network support.",
    keys:["wifi connected but no internet","wifi connects but no internet","connected but no internet","internet not working although wifi connected","wifi connected no internet","wifi connection but no internet","wifi connect bhayeko tara internet hudaina","wifi cha tara internet hudaina"] },

  { id:64, q:"Can't access company ERP or internal portal",                 cat:"Software Issue",    col:"amber",
    r:"Please ensure you are on the corporate network or VPN. Clear browser cache and try again, or use an incognito window. If access is still denied, I can raise a request with the applications team.",
    keys:["cannot access erp","erp not working","internal portal not accessible","company erp access","erp access hudaina","portal khuldaina","erp khuldaina","internal portal hudaina"] },

  { id:65, q:"Microsoft Teams microphone or speaker not working",           cat:"Software Issue",    col:"amber",
    r:"Please check Teams audio device settings and ensure the correct mic and speaker are selected. Rejoin the meeting or restart Teams, and update the audio drivers if needed.",
    keys:["teams mic not working","teams audio not working","mic hudaina teams","speaker hudaina teams","teams sound problem","teams audio issue","teams ma audio hudaina","teams microphone hudaina"] },

  { id:66, q:"Printer paper is jammed or stuck",                           cat:"Printer Issue",     col:"teal",
    r:"Paper jams can occur when the tray is overloaded or paper is misaligned. Remove the jam carefully, check the paper path for debris, and reload the paper tray correctly.",
    keys:["printer paper jam","paper jam printer","printer jam bhayo","printer paper stuck","paper stuck in printer","printer ma kagaz atko","kagaz atakyo printer","printer jam hudaina"] },

  { id:67, q:"Need access to the development or test server",               cat:"Access Request",    col:"purple", escalate:true,
    r:"Development and test server access often requires manager approval. Please provide your project name and justification so I can submit the access request.",
    keys:["need development server access","dev server access","test server access","development server hudaina","test server hudaina","dev server hudaina","server access request","dev server access request"] },

  { id:68, q:"Password reset email never arrives",                         cat:"Password Issue",    col:"blue",
    r:"If the password reset email does not arrive, check your spam/junk folder and verify the registered email address. If it still doesn't appear, I can ask IT to resend the reset link.",
    keys:["password reset email not received","reset email hudaina","password reset mail hudaina","reset link hudaina","password reset link not received","password reset link expired","password reset email missing"] },

  { id:69, q:"Can't sign in to Office 365 / Microsoft 365",               cat:"Email Issue",       col:"purple",
    r:"Please confirm your company username and password are correct, and try signing in from a different browser or an incognito window. If the issue persists, the account may be locked or require reactivation.",
    keys:["office 365 login not working","microsoft 365 login failed","office 365 sign in hudaina","microsoft login hudaina","o365 login hudaina","office 365 khuldaina"] },

  { id:70, q:"Need permission to install a browser extension or company app", cat:"Software Request",  col:"teal", escalate:true,
    r:"Installing browser extensions or business apps may require security review. Please send the extension name and purpose, and I will request approval from the security team.",
    keys:["browser extension permission","install extension request","software install permission","app install approval","extension install hudaina","app install hudaina","software install hudaina","browser extension hudaina"] },

  { id:71, q:"Screen cannot be mirrored in Meeting halls",                   cat:"Hardware Issue",    col:"amber",
    r:"Please ensure the HDMI or wireless display adapter is securely connected to the projector and your laptop. Try restarting the projector and your laptop's display settings. Press the display shortcut key and select Duplicate or Extend Display. If the issue continues, the adapter may need replacement.",
    keys:["screen cannot be mirrored","mirrored in meeting hall","mirror screen meeting","presentation screen not showing","screen sharing meeting hall","cannot mirror display","mirror display not working","display mirroring failed"] },

  { id:72, q:"HDMI cannot connect",                                          cat:"Hardware Issue",    col:"amber",
    r:"Please check whether the HDMI cable is properly connected to both your laptop and the display device. Try using another HDMI cable or port if available. Restart your device and the display, then reconnect the HDMI cable firmly.",
    keys:["hdmi cannot connect","hdmi not working","hdmi not detected","hdmi port not working","no hdmi signal","hdmi cable issue","hdmi connection failed","hdmi problem"] },

  { id:73, q:"Meeting hall screen cannot be used for presentations",        cat:"Hardware Issue",    col:"amber",
    r:"Please verify that the meeting room display is powered on and properly connected to the network or AV system. Check the input source on the display and ensure your laptop is connected via HDMI or wireless display. Contact the facilities team if the display remains unresponsive.",
    keys:["meeting hall screen not working","presentation screen not working","cannot use meeting room display","meeting room av not working","display not available meeting","hall display offline","presentation not showing on screen"] }
];

// ── Nepanglish / keyword normalization ─────────────────────────────────────
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const NEPANG_LISH = [
  ['internet chalena', 'internet not working'],
  ['wifi chalena', 'internet not working'],
  ['wifi connect hudaina', 'wifi not connecting'],
  ['wifi chaldaina', 'wifi not working'],
  ['printer chalena', 'printer not working'],
  ['printer chaldaina', 'printer not working'],
  ['printer offline cha', 'printer offline'],
  ['print ley kam garena', 'printer not working'],
  ['password birse', 'forgot password'],
  ['office mail khuldaina', 'outlook is not opening'],
  ['outlook khuldaina', 'outlook is not opening'],
  ['email khuldaina', 'email not opening'],
  ['laptop tattiraxa', 'laptop is overheating'],
  ['laptop heat huncha', 'laptop is overheating'],
  ['laptop ekdami slow chaliraxa', 'system is running very slowly'],
  ['system lastai slow xa', 'system is running very slowly'],
  ['mouse chalena', 'mouse not working'],
  ['keyboard chalena', 'keyboard not working'],
  ['vpn connect hudaina', 'vpn is not connecting'],
  ['vpn chalena', 'vpn is not connecting'],
  ['blue screen aayo', 'blue screen error'],
  ['internet chhaina', 'internet not working'],
  ['printer offline dekhairaxa', 'printer offline'],
  ['print hudaina', 'cannot print'],
  ['scan hudaina', 'scanner not detected'],
  ['wifi chhaina', 'wifi not working'],
  ['vpn disconnect hudaina', 'vpn disconnects frequently'],
  ['password reset hudaina', 'forgot my password'],
  ['email send hudaina', 'unable to send emails'],
  ['email pathaunai milena', 'unable to send emails'],
  ['hdmi kam garena', 'hdmi cannot connect'],
  ['hdmi hudaina', 'hdmi cannot connect'],
  ['hdmi connect bhayena', 'hdmi cannot connect'],
  ['meeting hall ma tv connect bhayena', 'meeting hall screen cannot be used'],
  ['presentation dina milena hall ma', 'meeting hall screen cannot be used'],
  ['screen connect bhayena', 'screen cannot be mirrored'],
  ['hall screen chalena', 'meeting hall screen not working'],
  ['meeting room ma screen chalena', 'meeting hall screen not working'],
  ['presentation display hudaina', 'presentation screen not showing'],
  ['meeting ma screen hudaina', 'meeting hall screen cannot be used'],
  ['av system chalena', 'meeting hall screen cannot be used']
];

function translateNepanglish(text) {
  let result = text.toLowerCase();
  for (const [nep, eng] of NEPANG_LISH) {
    const pattern = new RegExp(`\\b${escapeRegex(nep)}\\b`, 'gi');
    result = result.replace(pattern, eng);
  }
  return result;
}

function norm(s) {
  return translateNepanglish(s)
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findMatch(input) {
  const n = norm(input);
  const inputTokens = n.split(' ').filter(Boolean);
  const STOPWORDS = new Set(['the','is','are','a','an','and','or','not','no','my','i','you','to','on','in','for','of','that','this','it','with','unable','cant','cannot','please','still','working','work','doesnt','doesn','didnt','didn','have','has','be','by','from','as','at','but']);
  const inputContentTokens = inputTokens.filter(t => !STOPWORDS.has(t));
  let best = null, bestScore = 0;

  for (const item of KB) {
    let score = 0;
    const normalizedKeys = item.keys.map(norm);
    const queryKey = norm(item.q);

    // require at least one meaningful token (non-stopword) overlap between input and keys/query
    const queryTokens = queryKey.split(' ').filter(Boolean).filter(t => !STOPWORDS.has(t));
    const hasQueryTokenOverlap = queryTokens.some(t => inputContentTokens.includes(t));
    const keyTokensAll = normalizedKeys.flatMap(k => k.split(' ').filter(Boolean));
    const keyContentTokens = keyTokensAll.filter(t => !STOPWORDS.has(t));
    const hasKeyTokenOverlap = keyContentTokens.some(t => inputContentTokens.includes(t));

    // If there's no content-word overlap, skip this KB item to avoid matching on generic words like "not working".
    if (!hasQueryTokenOverlap && !hasKeyTokenOverlap) continue;

    if (n.includes(queryKey)) {
      score += queryKey.split(' ').length * 8;
    }

    for (const key of normalizedKeys) {
      if (!key) continue;
      if (n.includes(key)) {
        score += key.split(' ').length * 6;
      } else {
        const tokens = key.split(' ');
        let matched = 0;
        for (const token of tokens) {
          if (token.length > 2 && !STOPWORDS.has(token) && n.includes(token)) matched += 1;
        }
        score += matched * 3;
      }
    }

    // If the user included at least one exact keyword, boost the score.
    const tokens = n.split(' ');
    for (const key of normalizedKeys) {
      const keyTokens = key.split(' ');
      const anyMatch = keyTokens.some(t => t.length > 2 && !STOPWORDS.has(t) && tokens.includes(t));
      if (anyMatch) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return bestScore >= 10 ? best : null;
}

const FOLLOWUP_TRIGGERS = [
  "still not working","still not solved","didnt work","didn't work","still same",
  "no luck","still broken","same issue","still happening","nothing worked","still failed",
  "not resolved","not fixed","not solved","issue persists","still the issue",
  "problem persists","still there","same problem","doesn't work","does not work",
  "not helping","not fixed yet","still occurring",
  // Nepanglish / local variants
  "ali matrai ramro bhayena","pahila jasto hoina","pani nagareko cha","firta cha","kaam nagaryo",
  "kaam nagareko cha","thik bhayena","still kaam garena","phalana hudaina","same nai cha",
  "bhayena","kam garena","kam hudaina","thik hudaina","kaam hudaina","ramro bhayena"
];

function isFollowup(input) {
  const n = norm(input);
  return FOLLOWUP_TRIGGERS.some(t => n.includes(t));
}

module.exports = { KB, findMatch, isFollowup };
