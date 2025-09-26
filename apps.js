export const apps = {
    mario: {
        title: "Super Mario Bros.",
        icon: "mario_icon.png",
        content: `<iframe src="https://www.neptunjs.com/embed/nes/Super%20Mario%20Bros/"></iframe>`,
        width: 600,
        height: 520,
    },
    minecraft: {
        title: "Minecraft Classic",
        icon: "minecraft_icon.png",
        content: `<iframe src="https://classic.minecraft.net/"></iframe>`,
        width: 800,
        height: 600,
    },
    idle: {
        title: "IDLE (Python)",
        icon: "python_idle_icon.png",
        content: `<textarea placeholder="Write your Python code here...\n\n# Note: This is a simulation. Code execution is not implemented."></textarea>`,
        width: 600,
        height: 450,
    },
    notepad: {
        title: "Notepad",
        icon: "notepad_icon.png",
        content: `
            <div class="notepad-menu-bar">
                <ul>
                    <li>File
                        <ul>
                            <li class="save-as">Save As...</li>
                        </ul>
                    </li>
                </ul>
                 <ul><li>Edit</li></ul>
                 <ul><li>Help</li></ul>
            </div>
            <textarea class="notepad-textarea"></textarea>
        `,
        width: 500,
        height: 400,
    },
    myComputer: {
        title: "My Computer",
        icon: "my_computer_icon.png",
        content: `
            <div style="padding:10px; font-size:13px; background-color: #fff; height: 100%;">
                <p><strong>Files Stored on This Computer</strong></p>
                <hr style="margin: 5px 0;">
                <div class="my-computer-item">
                    <img src="my_documents_icon.png" width="32" height="32" alt="Shared Documents">
                    <span>Shared Documents</span>
                </div>
                <div class="my-computer-item">
                    <img src="my_documents_icon.png" width="32" height="32" alt="My Documents">
                    <span>User's Documents</span>
                </div>
                <hr style="margin: 5px 0;">
                <p><strong>Hard Disk Drives</strong></p>
                <hr style="margin: 5px 0;">
                <div class="my-computer-item">
                    <img src="hard_disk_icon.png" width="32" height="32" alt="Drive C">
                    <span>Local Disk (C:)</span>
                </div>
            </div>
        `,
        width: 450,
        height: 350,
    },
    recycleBin: {
        title: "Recycle Bin",
        icon: "recycle_bin_icon.png",
        content: `<div style="padding:20px; text-align:center; color:#555; font-size:13px; background: #fff; height: 100%; display: flex; align-items: center; justify-content: center;">The Recycle Bin is empty.</div>`,
        width: 400,
        height: 300,
    },
    minesweeper: {
        title: "Minesweeper",
        icon: "minesweeper_icon.png",
        content: `<iframe src="https://archive.org/embed/winmine_202106" style="width:100%; height: 100%; border:0;"></iframe>`,
        width: 300,
        height: 380,
    },
    solitaire: {
        title: "Solitaire",
        icon: "solitaire_icon.png",
        content: `<iframe src="https://archive.org/embed/ms_solitaire_202107" style="width:100%; height: 100%; border:0;"></iframe>`,
        width: 600,
        height: 450,
    },
    paint: {
        title: "Paint",
        icon: "paint_icon.png",
        content: `<iframe src="https://jspaint.app" style="width:100%; height: 100%; border:0;"></iframe>`,
        width: 700,
        height: 500,
    }
};