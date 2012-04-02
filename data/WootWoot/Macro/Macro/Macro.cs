using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;

namespace Macro
{
    public partial class Macro : Form
    {
        // Variables globales
        string codeDeCampagne = "101022160551_Med";

        int step = 1;
        int iteration = 0; // Compteur
        int captchaCounter = 0;
        int loginCounter = 0;
        Hotmailer hotmailer = new Hotmailer();

        string strAddress = ""; // Adresse Yahoo
        string strPassword = ""; // Mot de passe Yahoo
        string strRecipient = ""; // Adresse du récipient
        string strSubject = ""; // Sujet du message

        string aID = ""; // ID de la TextArea du champ "À:"
        string subjectID = ""; // ID de l'input du champ "Objet:"
        string ccID = ""; // ID de la TextArea du champ "Cc:"

        string messageSentID; // ID d'un élément présent lorsque le message est envoyé

        HtmlElement identity; // Mot de passe /tool
        HtmlElement campaignCode; // Code de campagne
        HtmlElement pressEnter; // DIV invisible (next();)
        HtmlElement pressEscape; // DIV invisible (reset();)
        HtmlElement address; // Compte Yahoo /tool
        HtmlElement password; // Mot de passe du compte Yahoo /tool
        HtmlElement recipient; // Récipient /tool
        HtmlElement subject; // Sujet /tool
        HtmlElement username; // Username page Yahoo login
        HtmlElement passwd; // Mot de passe page Yahoo login
        HtmlElement dotSave; // Bouton login (Yahoo)
        HtmlElement aArea; // TextArea "À:"
        HtmlElement input; // Input "Object/Sujet"

        HtmlElementCollection textAreas; // Collection des textAreas de Yahoo
        HtmlElementCollection inputs; // Collection des inputs de Yahoo
        HtmlElementCollection messageSent; // Éléments présetns lors de l'envoi du message

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = false)]
        static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

        [DllImport("user32.dll", SetLastError = true)]
        static extern IntPtr GetWindow(IntPtr hWnd, uint uCmd);

        [DllImport("user32.dll", CharSet=CharSet.Auto)]
        static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName,int nMaxCount);

        private const int INTERNET_OPTION_END_BROWSER_SESSION = 42;

        [DllImport("wininet.dll", SetLastError = true)]
        private static extern bool InternetSetOption(IntPtr hInternet, int dwOption, IntPtr lpBuffer, int lpdwBufferLength);


        public Macro()
        {
            InitializeComponent();
        }

        private void menuDemarrer_Click(object sender, EventArgs e)
        {
            webBrowser1.AllowNavigation = true;
            menuDemarrer.Enabled = false;
            menuArreter.Enabled = true;
            menuAide.Enabled = false;
            webBrowser1.Navigate("http://mail.yahoo.fr");

            // Désactive les popups affichant un erreur de script de IE
            webBrowser1.ScriptErrorsSuppressed = true;
        }

        private void menuArreter_Click(object sender, EventArgs e)
        {
            webBrowser1.AllowNavigation = false;
            menuDemarrer.Enabled = true;
            menuArreter.Enabled = false;
            menuAide.Enabled = true;
            timer1.Enabled = false;
            step = 0;

            /*messageSent = webBrowser1.Document.GetElementsByTagName("input");
            int jack = messageSent.Count;
            int bob = 1;*/
        }

        private void menuAPropos_Click(object sender, EventArgs e)
        {
            APropos aPropos = new APropos();
            aPropos.ShowDialog();
        }

        private void webBrowser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            timer1.Enabled = true;
        }

        private void clickOnWebBrowser(int cX, int cY)
        {
            // Clique sur les coordonnées en paramètre
            IntPtr handle = webBrowser1.Handle;
            StringBuilder className = new StringBuilder(100);
            while (className.ToString() != "Internet Explorer_Server")
            {
                handle = GetWindow(handle, 5); // 5 == child
                GetClassName(handle, className, className.Capacity);
            }

            IntPtr lParam = (IntPtr)((cY << 16) | cX);
            IntPtr wParam = IntPtr.Zero;
            const uint downCode = 0x201;
            const uint upCode = 0x202;
            SendMessage(handle, downCode, wParam, lParam); // mouseDown
            SendMessage(handle, upCode, wParam, lParam); // mouseUp
        }

        private void isRecipientValid()
        {
            // Vérifie que "À:" contient la bonne adresse
            HtmlElement aArea = webBrowser1.Document.GetElementById(aID);
            aArea.InvokeMember("focus");

            webBrowser1.Document.ExecCommand("SelectAll", true, null);
            webBrowser1.Document.ExecCommand("Copy", true, null);
            //webBrowser1.Document.ExecCommand("Unselect", true, null);
            string sully = Clipboard.GetText();
            if (Clipboard.GetText() != strRecipient)
            {
                // Échec: input récipient vide ou incomplet
                aArea.InvokeMember("focus");
                SendKeys.Send(strRecipient);
                isRecipientValid();
            }
        }

        private void isSubjectValid()
        {
            // Vérifie que "Objet:" contient le bon message
            HtmlElement input = webBrowser1.Document.GetElementById(subjectID);
            input.InvokeMember("focus");

            webBrowser1.Document.ExecCommand("SelectAll", true, null);
            webBrowser1.Document.ExecCommand("Copy", true, null);
            //webBrowser1.Document.ExecCommand("Unselect", true, null);

            if (Clipboard.GetText().Trim() != strSubject.Trim())
            {
                // Échec: input sujet vide ou incomplet
                input.InvokeMember("focus");
                SendKeys.Send(strSubject);
                isSubjectValid();
            }
        }

        private void isCcEmpty()
        {
            // Le message se retrouve parfois dans le champ "Cc:": on s'assure donc qu'il reste vide

            HtmlElementCollection textAreas = null;
            textAreas = webBrowser1.Document.GetElementsByTagName("textarea");

            // Parcours tous les éléments TextArea pour trouver l'ID du champ "Cc:" (qui est aléatoire mais commence toujours par "Cc")
            for (int i = 0; i <= textAreas.Count - 1; i++)
            {
                ccID = textAreas[i].GetAttribute("id");
                if (ccID.Length > 2)
                {
                    if (ccID.Substring(0, 2) == "Cc")
                    {
                        HtmlElement ccArea = webBrowser1.Document.GetElementById(ccID);
                        ccArea.InvokeMember("focus");

                        string previousClipBoard = Clipboard.GetText();

                        webBrowser1.Document.ExecCommand("Unselect", true, null);
                        webBrowser1.Document.ExecCommand("SelectAll", true, null);
                        webBrowser1.Document.ExecCommand("Copy", true, null);

                        if (Clipboard.GetText() != " ")
                        {
                            // Efface le contenu de "Cc:"
                            SendKeys.SendWait("{BACKSPACE}");

                            // Vérifie s'il y a eu un changement, sinon on assume que l'input est vide (sans espace)
                            webBrowser1.Document.ExecCommand("Unselect", true, null);
                            webBrowser1.Document.ExecCommand("SelectAll", true, null);
                            webBrowser1.Document.ExecCommand("Copy", true, null);
                            if (Clipboard.GetText() == previousClipBoard)
                            {
                                break;
                            }
                            
                            isCcEmpty();
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
        }

        private void ClearCookies()
        {
            string[] theCookies = System.IO.Directory.GetFiles(Environment.GetFolderPath(Environment.SpecialFolder.Cookies));
            foreach (string currentFile in theCookies)
            {
                try
                {
                    System.IO.File.Delete(currentFile);
                }
                catch
                {
                }
            }
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            switch (step)
            {
                case 1:

                    step = 0;
                    toolStep.Text = "Étape : 1";
                    hotmailer.webBrowser1.Navigate("http://google.com");
                    hotmailer.Show();
                    step = 2;

                    break;

                case 2:

                    step = 0;
                    toolStep.Text = "Étape : 2";

                    identity = hotmailer.webBrowser1.Document.GetElementById("identity");

                    /*
                     * Modifications for GAF
                     *
                     */

                    SendKeys.Send("test");
                    ClearCookies();
                    WebBrowserHelper.ClearCache();
                    break;

                    if (identity != null)
                    {
                        // Entre mot de passe
                        identity.Focus();
                    
                        SendKeys.Send("loubna");

                        if (identity.GetAttribute("value") != "loubna")
                        {
                            // La page n'était pas chargée
                            step = 2;
                            return;
                        }

                        // Entre code de campagne.
                        campaignCode = hotmailer.webBrowser1.Document.GetElementById("campaignCode");
                        campaignCode.Focus();

                        SendKeys.SendWait(codeDeCampagne);

                        while (campaignCode.GetAttribute("value") != codeDeCampagne)
                        {
                            campaignCode.Focus();

                            // Problème quelconque: on efface l'input et recommence.
                            while (campaignCode.GetAttribute("value") != "")
                            {
                                SendKeys.SendWait("{BACKSPACE}");
                            }

                            SendKeys.SendWait(codeDeCampagne);
                        }

                        // Clique sur une DIV invisble ayant onclick="next();": simule un "{ENTER}"
                        pressEnter = hotmailer.webBrowser1.Document.GetElementById("pressEnter");
                        pressEnter.InvokeMember("click");

                        step = 3;
                    }
                    else
                    {
                        step = 2;
                    }

                    break;

                case 3:

                    step = 0;
                    toolStep.Text = "Étape : 3";

                    // Collecte le compte Yahoo
                    address = hotmailer.webBrowser1.Document.GetElementById("address");
                    strAddress = address.GetAttribute("value");

                    if (strAddress == "")
                    {
                        // La page n'était pas chargée
                        step = 3;
                        return;
                    }

                    // Collecte le mot de passe
                    password = hotmailer.webBrowser1.Document.GetElementById("password");
                    strPassword = password.GetAttribute("value");

                    // Collecte le récipient
                    recipient = hotmailer.webBrowser1.Document.GetElementById("recipient");
                    strRecipient = recipient.GetAttribute("value");

                    // Collecte le sujet
                    subject = hotmailer.webBrowser1.Document.GetElementById("subject");
                    strSubject = subject.GetAttribute("value");

                    username = webBrowser1.Document.GetElementById("username");

                    if (username == null)
                    {
                        // Déjà loggé
                        hotmailer.Hide();
                        step = 6;
                    }
                    else
                    {
                        step = 4;
                    }

                    break;

                case 4:

                    step = 0;
                    toolStep.Text = "Étape : 4";
                    hotmailer.Hide();

                    // Injecte le nom de compte Yahoo
                    username = webBrowser1.Document.GetElementById("username");

                    if (username != null)
                    {
                        username.InvokeMember("focus");
                        SendKeys.SendWait(strAddress);

                        webBrowser1.Document.ExecCommand("SelectAll", true, null);
                        webBrowser1.Document.ExecCommand("Copy", true, null);

                        if (Clipboard.GetText() != strAddress)
                        {
                            // L'adresse n'a pas bien ete transmise
                            SendKeys.SendWait("^{BACKSPACE}");
                            step = 4;
                            break;
                        }
                        else
                        {
                            SendKeys.SendWait("{TAB}");

                            webBrowser1.Document.ExecCommand("SelectAll", true, null);
                            SendKeys.SendWait("^{BACKSPACE}");

                            // Injecte le mot de passe
                            passwd = webBrowser1.Document.GetElementById("passwd");
                            passwd.InvokeMember("focus");
                            SendKeys.SendWait(strPassword);

                            step = 5;
                        }
                    }
                    else
                    {
                        if (webBrowser1.Document.GetElementById("compose_button_label") != null)
                        {
                            // Login déjà fait. Page chargée.
                            step = 6;
                        }
                        else
                        {
                            step = 4;
                        }
                    }

                    break;

                case 5:

                    step = 0;
                    toolStep.Text = "Étape : 5";

                    loginCounter = 0;

                    webBrowser1.Document.ExecCommand("SelectAll", true, null);
                    webBrowser1.Document.ExecCommand("Copy", true, null);

                    if (Clipboard.GetText() == strAddress || Clipboard.GetText().IndexOf("●") != -1)
                    {
                        // Nous sommes bien dans un input dans contenant l'adresse ou le mot de passe
                        SendKeys.SendWait("{ENTER}");
                        step = 6;
                    }
                    else
                    {
                        step = 4;
                    }

                    // Envoie la form (ID du bouton connection: ".save")
                    /*dotSave = webBrowser1.Document.GetElementById(".save");

                    if (dotSave != null)
                    {
                        dotSave.InvokeMember("click");
                        loginCounter = 0;
                        step = 6;
                    }
                    else
                    {
                        step = 5;
                    }*/

              break;

                case 6:

                    step = 0;
                    toolStep.Text = "Étape : 6";

                    if (webBrowser1.Document.GetElementById("compose_button_label") != null)
                    {
                        // Injecte N pour ouvrir l'onglet nouveau message
                        SendKeys.SendWait("n");

                        textAreas = webBrowser1.Document.GetElementsByTagName("textarea");
                        if (textAreas.Count < 3)
                        {
                            step = 6;
                        }
                        else
                        {
                            step = 7;
                        }
                    }
                    else
                    {
                        loginCounter++;

                        if (loginCounter >= 5)
                        {
                            // Apres 5 tentatives, re-login
                            step = 4;
                        }
                        else{
                            step = 6;
                        }
                    }
                    
                    break;

                case 7:
            
                    step = 0;
                    toolStep.Text = "Étape : 7";

                    textAreas = null;
                    textAreas = webBrowser1.Document.GetElementsByTagName("textarea");

                    // Parcours tous les éléments TextArea pour trouver l'ID du champ "À:" (qui est aléatoire mais commence toujours par "Toi")
                    for (int i = 0; i <= textAreas.Count - 1; i++)
                    {
                        aID = textAreas[i].GetAttribute("id");
                        if (aID.Length > 3)
                        {
                            if (aID.Substring(0, 3) == "Toi")
                            {
                                aArea = webBrowser1.Document.GetElementById(aID);
                                aArea.InvokeMember("focus");
                                SendKeys.SendWait(strRecipient);
                            
                                step = 8;
                                break;
                            }
                        }
                    }
                    
                    break;

                case 8:
            
                    step = 0;
                    toolStep.Text = "Étape : 8";

                    // Vérifie que "À:" contient la bonne adresse
                    aArea = webBrowser1.Document.GetElementById(aID);
                    aArea.InvokeMember("focus");

                    webBrowser1.Document.ExecCommand("SelectAll", true, null);
                    webBrowser1.Document.ExecCommand("Copy", true, null);
                    //webBrowser1.Document.ExecCommand("Unselect", true, null);

                    if (Clipboard.GetText() != strRecipient)
                    {
                        // Échec: input récipient vide ou incomplet
                        aArea.InvokeMember("focus");
                        SendKeys.SendWait(strRecipient);
                        step = 8;
                    }
                    else
                    {
                        step = 9;
                    }
                    
                    break;

                case 9:
            
                    step = 0;
                    toolStep.Text = "Étape : 9";

                    // TAB à l'input "Sujet", au cas ou Focus() fail
                    SendKeys.SendWait("{TAB}");
                    SendKeys.SendWait("{TAB}");

                    inputs = webBrowser1.Document.GetElementsByTagName("input");

                    // Parcours tous les éléments Input pour trouver l'ID du champ "Objet:" (qui est aléatoire mais commence toujours par "Subject")
                    for (int i = 0; i <= inputs.Count - 1; i++)
                    {
                        subjectID = inputs[i].GetAttribute("id");
                        if (subjectID.Length > 6)
                        {
                            if (subjectID.Substring(0, 7) == "Subject")
                            {
                                input = webBrowser1.Document.GetElementById(subjectID);
                                input.InvokeMember("focus");
                                SendKeys.SendWait(strSubject);
                                step = 10;
                                break;
                            }
                        }
                    }

                    break;

                case 10:
            
                    step = 0;
                    toolStep.Text = "Étape : 10";

                    // Vérifie que "Objet:" contient le bon message
                    input = webBrowser1.Document.GetElementById(subjectID);
                    input.InvokeMember("focus");

                    webBrowser1.Document.ExecCommand("SelectAll", true, null);
                    webBrowser1.Document.ExecCommand("Copy", true, null);
                    //webBrowser1.Document.ExecCommand("Unselect", true, null);

                    if (Clipboard.GetText() != strSubject)
                    {
                        // Échec: input sujet vide ou incomplet
                        input.InvokeMember("focus");
                        SendKeys.SendWait(strSubject);
                        step = 10;
                    }
                    else
                    {
                        // Tab à la textArea du message
                        SendKeys.SendWait("{TAB}");

                        hotmailer.Show();
                        step = 11;
                    }

                    break;

                case 11:

                    step = 0;
                    toolStep.Text = "Étape : 11";

                    // Focus sur l'IFRAME.
                    subject = hotmailer.webBrowser1.Document.GetElementById("subject");
                    subject.Focus();
                    SendKeys.SendWait("{TAB}");

                    // Vide le clipboard
                    Clipboard.Clear();

                    // CTRL + A, CTRL + C pour transférer le message au clipboard
                    hotmailer.webBrowser1.Document.ExecCommand("SelectAll", true, null);
                    hotmailer.webBrowser1.Document.ExecCommand("Copy", true, null);

                    if (Clipboard.GetText().IndexOf("Si vous souhaitez ne plus recevoir cette newsletter") == -1)
                    {
                        // Échec: IFRAME non chargé, clipboard vide ou incomplet
                        step = 11;
                    }
                    else
                    {
                        hotmailer.webBrowser1.Document.ExecCommand("Unselect", true, null);

                        hotmailer.Hide();
                        step = 12;
                    }

                    break;

                case 12:

                    step = 0;
                    toolStep.Text = "Étape : 12";

                    // Injecte le message
                    webBrowser1.Document.ExecCommand("Paste", true, null);

                    // Vérifie que le champ du message n'est pas vide
                    /*input = webBrowser1.Document.GetElementById(subjectID);
                    input.InvokeMember("focus");*/
                    SendKeys.SendWait("{TAB}");

                    webBrowser1.Document.ExecCommand("SelectAll", true, null);
                    webBrowser1.Document.ExecCommand("Copy", true, null);
                    webBrowser1.Document.ExecCommand("Unselect", true, null);

                    if (Clipboard.GetText().IndexOf("Si vous souhaitez ne plus recevoir cette newsletter") == -1)
                    {
                        // Échec: message absent ou incomplet
                        step = 12;
                    }
                    else
                    {
                        // Remonte à "Cc:"
                        SendKeys.SendWait("+{TAB}");
                        SendKeys.SendWait("+{TAB}");
                        // Injecte un espace dans "Cc:" pour pouvoir vérifier s'il ne contient que cela (s'il est vide, CTRL+A CTRL+C ne l'indique pas)
                        SendKeys.SendWait(" ");

                        step = 13;
                    }
                    
                    break;

                case 13:

                    step = 0;
                    toolStep.Text = "Étape : 13";

                    isCcEmpty();

                    // Remonte à "À:" (SHIT+TAB) au cas où focus fail
                    SendKeys.SendWait("+{TAB}");

                    step = 14;

                    break;

                case 14:

                    step = 0;
                    toolStep.Text = "Étape : 14";

                    isRecipientValid();

                    // Descend à "Sujet:" (TAB) au cas où focus fail
                    SendKeys.SendWait("{TAB}");
                    SendKeys.SendWait("{TAB}");

                    step = 15;

                    break;

                case 15:

                    step = 0;
                    toolStep.Text = "Étape : 15";
                    isSubjectValid();
                    step = 16;

                    break;

                case 16:

                    step = 0;
                    toolStep.Text = "Étape : 16";

                    // Envoie le message (CTRL + ENTER)
                    SendKeys.SendWait("^{ENTER}");

                    // Clique a une certaine coordonnée, là où le message de bienvenue de Yahoo peut apparaître
                    //clickOnWebBrowser(535, 450);

                    step = 17;

                    break;

                case 17:

                    step = 0;

                    captchaCounter = 0;
                    toolStep.Text = "Étape : 17";

                    // Vérification de captcha
                    // Si 3 inputs ont comme ID "firstName[...]", le message est envoyé.

                    messageSent = webBrowser1.Document.GetElementsByTagName("input");

                    for (int i = 0; i <= messageSent.Count - 1; i++)
                    {
                        messageSentID = messageSent[i].GetAttribute("id");

                        if (messageSentID.IndexOf("firstName") != -1)
                        {
                            captchaCounter++;
                        }

                        if (messageSentID.IndexOf("captcha_resp") != -1)
                        {
                            // Captcha!
                            step = 19;
                            goto Fin;
                        }
                    }

                    if (captchaCounter >= 3)
                    {
                        // Message envoyé, ferme l'onglet (CTRL+BACKSPACE)
                        step = 18;
                        SendKeys.Send("^{BACKSPACE}");
                    }
                    else
                    {
                        // "Envoi du message..."
                        step = 17;
                    }

            Fin:

                    break;

                case 18:

                    step = 0;
                    toolStep.Text = "Étape : 18";

                    // Génère prochain mail.
                    pressEnter = hotmailer.webBrowser1.Document.GetElementById("pressEnter");

                    if (pressEnter != null)
                    {
                        hotmailer.Show();
                        pressEnter.InvokeMember("click");

                        step = 20;
                    }
                    else
                    {
                        step = 18;
                    }

                    break;

                case 19:

                    step = 0;
                    toolStep.Text = "Étape : 19";

                    // Reset le compteur de /tool
                    pressEscape = hotmailer.webBrowser1.Document.GetElementById("pressEscape");

                    if (pressEscape != null)
                    {
                        hotmailer.Show();
                        pressEscape.InvokeMember("click");

                        // Génère un nouveau compte Yahoo
                        pressEnter.InvokeMember("click");

                        step = 20;
                    }
                    else
                    {
                        step = 19;
                    }

                    break;


                case 20:

                    step = 0;
                    toolStep.Text = "Étape : 20";

                    // Attend que le récipient ai changé (page chargée)
                    recipient = hotmailer.webBrowser1.Document.GetElementById("recipient");

                    string tmpRecipient = recipient.GetAttribute("value");

                    if (tmpRecipient != strRecipient && tmpRecipient != null && tmpRecipient != "")
                    {
                        //iteration++;

                        address = hotmailer.webBrowser1.Document.GetElementById("address");

                        string tmpAddress = address.GetAttribute("value");

                        if (tmpAddress != strAddress)
                        {
                            iteration++;

                            strAddress = tmpAddress;
                            strRecipient = tmpRecipient;

                            // Collecte le mot de passe
                            password = hotmailer.webBrowser1.Document.GetElementById("password");
                            strPassword = password.GetAttribute("value");

                            // Efface les cookies
                            ClearCookies();

                            // Efface le cache
                            WebBrowserHelper.ClearCache();

                            // Ferme la session
                            InternetSetOption(IntPtr.Zero, INTERNET_OPTION_END_BROWSER_SESSION, IntPtr.Zero, 0);

                            // Rafraîchit la page
                            webBrowser1.Document.Window.Navigate("http://login.yahoo.com/config/login_verify2?.intl=fr&.src=ym");
                            //webBrowser1.Document.Window.Navigate("http://mail.yahoo.fr");

                            step = 4;
                        }
                        else
                        {
                            hotmailer.Hide();
                            strRecipient = tmpRecipient;

                            step = 6;
                            //iteration++;
                        }
                    }
                    else
                    {
                        step = 20;
                    }

                    break;
            }
        }
    }
}

// Class pour supprimer le cache du webBrowser: http://www.gutgames.com/post/Clearing-the-Cache-of-a-WebBrowser-Control.aspx
static class WebBrowserHelper
{
    #region Definitions/DLL Imports
    // For PInvoke: Contains information about an entry in the Internet cache
    [StructLayout(LayoutKind.Explicit, Size = 80)]
    public struct INTERNET_CACHE_ENTRY_INFOA
    {
        [FieldOffset(0)]
        public uint dwStructSize;
        [FieldOffset(4)]
        public IntPtr lpszSourceUrlName;
        [FieldOffset(8)]
        public IntPtr lpszLocalFileName;
        [FieldOffset(12)]
        public uint CacheEntryType;
        [FieldOffset(16)]
        public uint dwUseCount;
        [FieldOffset(20)]
        public uint dwHitRate;
        [FieldOffset(24)]
        public uint dwSizeLow;
        [FieldOffset(28)]
        public uint dwSizeHigh;
        [FieldOffset(32)]
        public FILETIME LastModifiedTime;
        [FieldOffset(40)]
        public FILETIME ExpireTime;
        [FieldOffset(48)]
        public FILETIME LastAccessTime;
        [FieldOffset(56)]
        public FILETIME LastSyncTime;
        [FieldOffset(64)]
        public IntPtr lpHeaderInfo;
        [FieldOffset(68)]
        public uint dwHeaderInfoSize;
        [FieldOffset(72)]
        public IntPtr lpszFileExtension;
        [FieldOffset(76)]
        public uint dwReserved;
        [FieldOffset(76)]
        public uint dwExemptDelta;
    }

    // For PInvoke: Initiates the enumeration of the cache groups in the Internet cache
    [DllImport(@"wininet",
        SetLastError = true,
        CharSet = CharSet.Auto,
        EntryPoint = "FindFirstUrlCacheGroup",
        CallingConvention = CallingConvention.StdCall)]
    public static extern IntPtr FindFirstUrlCacheGroup(
        int dwFlags,
        int dwFilter,
        IntPtr lpSearchCondition,
        int dwSearchCondition,
        ref long lpGroupId,
        IntPtr lpReserved);

    // For PInvoke: Retrieves the next cache group in a cache group enumeration
    [DllImport(@"wininet",
        SetLastError = true,
        CharSet = CharSet.Auto,
        EntryPoint = "FindNextUrlCacheGroup",
        CallingConvention = CallingConvention.StdCall)]
    public static extern bool FindNextUrlCacheGroup(
        IntPtr hFind,
        ref long lpGroupId,
        IntPtr lpReserved);

    // For PInvoke: Releases the specified GROUPID and any associated state in the cache index file
    [DllImport(@"wininet",
        SetLastError = true,
        CharSet = CharSet.Auto,
        EntryPoint = "DeleteUrlCacheGroup",
        CallingConvention = CallingConvention.StdCall)]
    public static extern bool DeleteUrlCacheGroup(
        long GroupId,
        int dwFlags,
        IntPtr lpReserved);

    // For PInvoke: Begins the enumeration of the Internet cache
    [DllImport(@"wininet",
        SetLastError = true,
        CharSet = CharSet.Auto,
        EntryPoint = "FindFirstUrlCacheEntryA",
        CallingConvention = CallingConvention.StdCall)]
    public static extern IntPtr FindFirstUrlCacheEntry(
        [MarshalAs(UnmanagedType.LPTStr)] string lpszUrlSearchPattern,
        IntPtr lpFirstCacheEntryInfo,
        ref int lpdwFirstCacheEntryInfoBufferSize);

    // For PInvoke: Retrieves the next entry in the Internet cache
    [DllImport(@"wininet",
        SetLastError = true,
        CharSet = CharSet.Auto,
        EntryPoint = "FindNextUrlCacheEntryA",
        CallingConvention = CallingConvention.StdCall)]
    public static extern bool FindNextUrlCacheEntry(
        IntPtr hFind,
        IntPtr lpNextCacheEntryInfo,
        ref int lpdwNextCacheEntryInfoBufferSize);

    // For PInvoke: Removes the file that is associated with the source name from the cache, if the file exists
    [DllImport(@"wininet",
        SetLastError = true,
        CharSet = CharSet.Auto,
        EntryPoint = "DeleteUrlCacheEntryA",
        CallingConvention = CallingConvention.StdCall)]
    public static extern bool DeleteUrlCacheEntry(
        IntPtr lpszUrlName);
    #endregion

    #region Public Static Functions
    /// <summary>
    /// Clears the cache of the web browser
    /// </summary>
    public static void ClearCache()
    {
        // Indicates that all of the cache groups in the user's system should be enumerated
        const int CACHEGROUP_SEARCH_ALL = 0x0;
        // Indicates that all the cache entries that are associated with the cache group
        // should be deleted, unless the entry belongs to another cache group.
        const int CACHEGROUP_FLAG_FLUSHURL_ONDELETE = 0x2;
        // File not found.
        const int ERROR_FILE_NOT_FOUND = 0x2;
        // No more items have been found.
        const int ERROR_NO_MORE_ITEMS = 259;
        // Pointer to a GROUPID variable
        long groupId = 0;

        // Local variables
        int cacheEntryInfoBufferSizeInitial = 0;
        int cacheEntryInfoBufferSize = 0;
        IntPtr cacheEntryInfoBuffer = IntPtr.Zero;
        INTERNET_CACHE_ENTRY_INFOA internetCacheEntry;
        IntPtr enumHandle = IntPtr.Zero;
        bool returnValue = false;

        // Delete the groups first.
        // Groups may not always exist on the system.
        // For more information, visit the following Microsoft Web site:
        // http://msdn.microsoft.com/library/?url=/workshop/networking/wininet/overview/cache.asp   
        // By default, a URL does not belong to any group. Therefore, that cache may become
        // empty even when the CacheGroup APIs are not used because the existing URL does not belong to any group.   
        enumHandle = FindFirstUrlCacheGroup(0, CACHEGROUP_SEARCH_ALL, IntPtr.Zero, 0, ref groupId, IntPtr.Zero);
        // If there are no items in the Cache, you are finished.
        if (enumHandle != IntPtr.Zero && ERROR_NO_MORE_ITEMS == Marshal.GetLastWin32Error())
            return;

        // Loop through Cache Group, and then delete entries.
        while (true)
        {
            if (ERROR_NO_MORE_ITEMS == Marshal.GetLastWin32Error() || ERROR_FILE_NOT_FOUND == Marshal.GetLastWin32Error()) { break; }
            // Delete a particular Cache Group.
            returnValue = DeleteUrlCacheGroup(groupId, CACHEGROUP_FLAG_FLUSHURL_ONDELETE, IntPtr.Zero);
            if (!returnValue && ERROR_FILE_NOT_FOUND == Marshal.GetLastWin32Error())
            {
                returnValue = FindNextUrlCacheGroup(enumHandle, ref groupId, IntPtr.Zero);
            }

            if (!returnValue && (ERROR_NO_MORE_ITEMS == Marshal.GetLastWin32Error() || ERROR_FILE_NOT_FOUND == Marshal.GetLastWin32Error()))
                break;
        }

        // Start to delete URLs that do not belong to any group.
        enumHandle = FindFirstUrlCacheEntry(null, IntPtr.Zero, ref cacheEntryInfoBufferSizeInitial);
        if (enumHandle != IntPtr.Zero && ERROR_NO_MORE_ITEMS == Marshal.GetLastWin32Error())
            return;

        cacheEntryInfoBufferSize = cacheEntryInfoBufferSizeInitial;
        cacheEntryInfoBuffer = Marshal.AllocHGlobal(cacheEntryInfoBufferSize);
        enumHandle = FindFirstUrlCacheEntry(null, cacheEntryInfoBuffer, ref cacheEntryInfoBufferSizeInitial);

        while (true)
        {
            internetCacheEntry = (INTERNET_CACHE_ENTRY_INFOA)Marshal.PtrToStructure(cacheEntryInfoBuffer, typeof(INTERNET_CACHE_ENTRY_INFOA));
            if (ERROR_NO_MORE_ITEMS == Marshal.GetLastWin32Error()) { break; }

            cacheEntryInfoBufferSizeInitial = cacheEntryInfoBufferSize;
            returnValue = DeleteUrlCacheEntry(internetCacheEntry.lpszSourceUrlName);
            if (!returnValue)
            {
                returnValue = FindNextUrlCacheEntry(enumHandle, cacheEntryInfoBuffer, ref cacheEntryInfoBufferSizeInitial);
            }
            if (!returnValue && ERROR_NO_MORE_ITEMS == Marshal.GetLastWin32Error())
            {
                break;
            }
            if (!returnValue && cacheEntryInfoBufferSizeInitial > cacheEntryInfoBufferSize)
            {
                cacheEntryInfoBufferSize = cacheEntryInfoBufferSizeInitial;
                cacheEntryInfoBuffer = Marshal.ReAllocHGlobal(cacheEntryInfoBuffer, (IntPtr)cacheEntryInfoBufferSize);
                returnValue = FindNextUrlCacheEntry(enumHandle, cacheEntryInfoBuffer, ref cacheEntryInfoBufferSizeInitial);
            }
        }
        Marshal.FreeHGlobal(cacheEntryInfoBuffer);
    }
    #endregion
}