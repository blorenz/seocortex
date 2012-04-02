namespace Macro
{
    partial class Macro
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Macro));
            this.webBrowser1 = new System.Windows.Forms.WebBrowser();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.menuDemarrer = new System.Windows.Forms.ToolStripMenuItem();
            this.menuArreter = new System.Windows.Forms.ToolStripMenuItem();
            this.menuAide = new System.Windows.Forms.ToolStripMenuItem();
            this.menuAPropos = new System.Windows.Forms.ToolStripMenuItem();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.toolStep = new System.Windows.Forms.ToolStripStatusLabel();
            this.menuStrip1.SuspendLayout();
            this.statusStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // webBrowser1
            // 
            this.webBrowser1.AllowNavigation = false;
            this.webBrowser1.Location = new System.Drawing.Point(12, 27);
            this.webBrowser1.MinimumSize = new System.Drawing.Size(20, 20);
            this.webBrowser1.Name = "webBrowser1";
            this.webBrowser1.Size = new System.Drawing.Size(960, 625);
            this.webBrowser1.TabIndex = 0;
            this.webBrowser1.DocumentCompleted += new System.Windows.Forms.WebBrowserDocumentCompletedEventHandler(this.webBrowser1_DocumentCompleted);
            // 
            // timer1
            // 
            this.timer1.Interval = 1000;
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuDemarrer,
            this.menuArreter,
            this.menuAide});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(984, 24);
            this.menuStrip1.TabIndex = 2;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // menuDemarrer
            // 
            this.menuDemarrer.Name = "menuDemarrer";
            this.menuDemarrer.Size = new System.Drawing.Size(68, 20);
            this.menuDemarrer.Text = "Démarrer";
            this.menuDemarrer.Click += new System.EventHandler(this.menuDemarrer_Click);
            // 
            // menuArreter
            // 
            this.menuArreter.Enabled = false;
            this.menuArreter.Name = "menuArreter";
            this.menuArreter.Size = new System.Drawing.Size(55, 20);
            this.menuArreter.Text = "Arrêter";
            this.menuArreter.Click += new System.EventHandler(this.menuArreter_Click);
            // 
            // menuAide
            // 
            this.menuAide.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuAPropos});
            this.menuAide.Name = "menuAide";
            this.menuAide.Size = new System.Drawing.Size(43, 20);
            this.menuAide.Text = "Aide";
            // 
            // menuAPropos
            // 
            this.menuAPropos.Name = "menuAPropos";
            this.menuAPropos.Size = new System.Drawing.Size(225, 22);
            this.menuAPropos.Text = "À propos de Inboxer - Macro";
            this.menuAPropos.Click += new System.EventHandler(this.menuAPropos_Click);
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStep});
            this.statusStrip1.Location = new System.Drawing.Point(0, 655);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(984, 22);
            this.statusStrip1.TabIndex = 0;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // toolStep
            // 
            this.toolStep.Name = "toolStep";
            this.toolStep.Size = new System.Drawing.Size(50, 17);
            this.toolStep.Text = "Étape : -";
            // 
            // Macro
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(984, 677);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.webBrowser1);
            this.Controls.Add(this.menuStrip1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "Macro";
            this.Text = "Inboxer - Macro";
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.WebBrowser webBrowser1;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem menuDemarrer;
        private System.Windows.Forms.ToolStripMenuItem menuAide;
        private System.Windows.Forms.ToolStripMenuItem menuAPropos;
        private System.Windows.Forms.ToolStripMenuItem menuArreter;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel toolStep;
    }
}

