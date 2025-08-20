# Bulk Name & Position Batch Photoshop Automation Script

**Bulk Name & Position Batch Photoshop Automation Script** is an Adobe Photoshop ExtendScript (`.jsx`) that automates the process of generating multiple **PNG exports** from a single **PSD template**.  

This tool is designed for cases where you have a **list of names and positions** (e.g., TXT/CSV file) and need to create **personalized graphics in bulk**. Instead of manually editing text layers in Photoshop for each entry, the script reads from your input file and automatically updates the text layers, exporting a clean PNG for each record.  

---

## ✨ Key Features
- **Bulk Automation** – Generate dozens or hundreds of PNGs in one run.  
- **Dynamic Text Replacement** – Automatically replaces two text layers named `Name` and `Position`.  
- **Input File Support** – Works with TXT or CSV files (`name,position` per line).  
- **Smart Exporting** – Each PNG is named in the format `1 - <Name>.png`, `2 - <Name>.png`, etc.  
- **Error Handling** – Skips malformed lines and detects missing layers.  
- **Filename Safety** – Removes invalid characters and trims overly long names.  
- **Non-Destructive** – Keeps your original PSD unchanged.  

---

## 🛠️ Use Cases
This script is perfect for bulk design tasks such as:
- Certificates (Name + Role/Title)  
- Event Badges (Name + Position)  
- Membership Cards  
- Awards & Recognition Graphics  
- Custom ID cards or passes  
- Nameplates for presentations or events  

Anywhere you need to combine a **base design** with **dynamic text data**, this saves hours of manual work.  

---

## 📂 How It Works
1. **Prepare a PSD template** with two editable text layers named exactly:  
   - `Name`  
   - `Position`  
2. **Create a TXT or CSV file** where each line contains:  
   ```txt
   Name,Position
   Jane Doe,Project Manager
   John Smith,Software Engineer
3. **Run the script in Photoshop:**
   - `Go to File → Scripts → Browse… and select the .jsx script`
   - `Pick your PSD template`
   - `Pick your TXT/CSV input file`
   - `Choose an output folder`
4. **The script updates text layers for each row and saves a PNG into your chosen folder.**

⚙️ Technical Details
- Written in Adobe ExtendScript (JSX)
- Compatible with Photoshop on Windows & macOS
- Uses standard APIs: LayerKind.TEXT, PNGSaveOptions, File, Folder
- Auto-skips header rows (if they contain “name” and “position”)
- Handles extra commas in positions by merging them into one field

📌 Example Workflow

**Input (TXT/CSV):**
*Name,Position*
- Leo Lion Manoj Tiwari,District Council President
- Leo Lion Shiv Shankar Mandal,IPDP
- Leo Lion Suresh Karki,Leo Club Chairperson


**Output (PNG files):**
- 1 - Leo Lion Manoj Tiwari.png
- 2 - Leo Lion Shiv Shankar Mandal.png
-3 - Leo Lion Suresh Karki.png


*Each file contains the base PSD design with text layers updated accordingly.*


