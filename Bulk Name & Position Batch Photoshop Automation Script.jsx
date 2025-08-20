/**
 * Batch PNG Export from PSD with Name/Position replacements
 * Usage:
 * 1) Open Photoshop.
 * 2) File → Scripts → Browse… and select this .jsx.
 * 3) When prompted, pick the PSD template (must contain text layers named "Name" and "Position").
 * 4) Pick the TXT/CSV file with rows like: Name,Position
 * 5) Choose an output folder. Script will export one PNG per row.
 *
 * Notes:
 * - The script searches for text layers named EXACTLY "Name" and "Position".
 * - Filenames are sanitized: "<rowNumber> - <name>.png".
 * - Keeps all other layers unchanged.
 */

#target photoshop
app.bringToFront();

// Ensure we're not showing modal dialogs
app.displayDialogs = DialogModes.NO;

function findTextLayerByName(container, layerName) {
    for (var i = 0; i < container.layers.length; i++) {
        var lyr = container.layers[i];
        if (lyr.typename === "ArtLayer" && lyr.kind === LayerKind.TEXT && lyr.name === layerName) {
            return lyr;
        }
        if (lyr.typename === "LayerSet") {
            var found = findTextLayerByName(lyr, layerName);
            if (found) return found;
        }
    }
    return null;
}

function setText(lyr, content) {
    lyr.textItem.contents = content;
}

function sanitizeFilename(s) {
    // Remove characters invalid on most filesystems
    var invalid = /[\\\/\:\*\?\"\<\>\|]+/g;
    var cleaned = s.replace(invalid, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
    // Limit length to avoid overly long filenames
    if (cleaned.length > 120) cleaned = cleaned.substring(0, 120);
    return cleaned;
}

function exportActiveDocToPNG(outFolder, baseName) {
    var file = new File(outFolder.fsName + "/" + baseName + ".png");
    var opts = new PNGSaveOptions();
    opts.interlaced = false;
    app.activeDocument.saveAs(file, opts, true, Extension.LOWERCASE);
}

function parseCSVLine(line) {
    // Simple CSV split by comma (no quotes support). Trim spaces.
    // Expected format: Name,Position
    var parts = line.split(",");
    for (var i = 0; i < parts.length; i++) parts[i] = parts[i].replace(/^\s+|\s+$/g, "");
    return parts;
}

function main() {
    // Pick the PSD template
    var psdFile = File.openDialog("Select the PSD template (must contain 'Name' and 'Position' text layers)", "Photoshop PSD:*.psd");
    if (!psdFile) { alert("No PSD selected."); return; }
    var doc = app.open(psdFile);

    // Find target text layers
    var nameLayer = findTextLayerByName(doc, "Name");
    var positionLayer = findTextLayerByName(doc, "Position");
    if (!nameLayer || !positionLayer) {
        alert("Couldn't find text layers named 'Name' and 'Position'. Please check your PSD.");
        return;
    }

    // Pick the TXT/CSV file
    var txtFile = File.openDialog("Select the TXT/CSV file with 'name,position' per line", "Text/CSV:*.txt;*.csv");
    if (!txtFile) { alert("No TXT/CSV selected."); return; }

    // Pick output folder
    var outFolder = Folder.selectDialog("Select output folder for PNGs");
    if (!outFolder) { alert("No output folder selected."); return; }

    // Read lines
    if (!txtFile.open('r')) { alert("Failed to open the TXT/CSV file."); return; }
    var lines = [];
    while (!txtFile.eof) {
        var line = txtFile.readln();
        if (line && line.replace(/\s+/g, '').length > 0) {
            lines.push(line);
        }
    }
    txtFile.close();

    // Process each row
    var rowNumber = 1;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        // Skip header if it looks like one (contains "name" and "position")
        if (/name/i.test(line) && /position/i.test(line)) {
            continue;
        }

        var cols = parseCSVLine(line);
        if (cols.length < 2) {
            // Skip malformed lines
            continue;
        }
        var personName = cols[0];
        var personPosition = cols.slice(1).join(","); // In case there were extra commas

        // Update text layers
        setText(nameLayer, personName);
        setText(positionLayer, personPosition);

        // Build filename and export
        var baseName = sanitizeFilename(rowNumber + " - " + personName);
        exportActiveDocToPNG(outFolder, baseName);
        rowNumber++;
    }

    alert("Done! Exported " + (rowNumber - 1) + " PNG files to: " + outFolder.fsName);
}

try {
    main();
} catch (e) {
    alert("Error: " + e.message);
}
