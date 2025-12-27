import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import os
from pathlib import Path

class CpuEntryApp:
    MANUFACTURERS = ["AMD", "Intel"]
    SOCKETS = ["AM5", "AM4", "LGA1700", "LGA1200", "LGA1151", "sTRX4", "sWRX8"]
    MICROARCHITECTURES = ["Zen 5", "Zen 4", "Zen 3", "Zen 2", "Zen+", "Zen", "Arrow Lake", "Raptor Lake Refresh", "Raptor Lake", "Alder Lake", "Rocket Lake", "Comet Lake", "Cascade Lake"]
    GRAPHICS = ["None", "AMD Radeon™ Graphics"]

    def __init__(self, root):
        self.root = root
        self.root.title("CPU Data Entry")
        self.root.geometry("1000x900")
        
        self.selected_filename = ""
        self.data = {
            "name": "", "socket": "", "microarchitecture": "", "cores": "",
            "threads": "", "baseClock": "", "boostClock": "", "tdp": "",
            "l1Cache": "", "l2Cache": "", "l3Cache": "", "manufacturer": "",
            "graphics": "", "image": ""
        }
        
        self.create_widgets()
        self.load_cpus()

    def create_widgets(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title = ttk.Label(main_frame, text="CPU Data Entry", font=("Arial", 18, "bold"))
        title.grid(row=0, column=0, columnspan=4, pady=15)
        
        # Name
        ttk.Label(main_frame, text="Name:").grid(row=1, column=0, sticky=tk.W, pady=8)
        self.name_var = tk.StringVar()
        name_entry = ttk.Entry(main_frame, textvariable=self.name_var, width=30)
        name_entry.grid(row=1, column=1, columnspan=3, sticky=(tk.W, tk.E), pady=8)
        name_entry.bind("<KeyRelease>", lambda e: self.check_duplicate_cpu())
        
        # Duplicate CPU Status
        self.duplicate_status_var = tk.StringVar()
        self.duplicate_status_var.set("")
        ttk.Label(main_frame, textvariable=self.duplicate_status_var, foreground="red", font=("Arial", 10, "bold")).grid(row=2, column=1, sticky=tk.W, pady=0)
        
        # Manufacturer
        ttk.Label(main_frame, text="Manufacturer:").grid(row=3, column=0, sticky=tk.W, pady=8)
        self.manufacturer_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.manufacturer_var, values=self.MANUFACTURERS, state="readonly", width=15).grid(row=3, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Socket
        ttk.Label(main_frame, text="Socket:").grid(row=4, column=0, sticky=tk.W, pady=8)
        self.socket_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.socket_var, values=self.SOCKETS, state="readonly", width=15).grid(row=4, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Microarchitecture
        ttk.Label(main_frame, text="Microarchitecture:").grid(row=4, column=2, sticky=tk.W, pady=8)
        self.microarch_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.microarch_var, values=self.MICROARCHITECTURES, state="readonly", width=15).grid(row=4, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Cores
        ttk.Label(main_frame, text="Cores:").grid(row=5, column=0, sticky=tk.W, pady=8)
        self.cores_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.cores_var, width=15).grid(row=5, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Threads
        ttk.Label(main_frame, text="Threads:").grid(row=5, column=2, sticky=tk.W, pady=8)
        self.threads_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.threads_var, width=15).grid(row=5, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Base Clock
        ttk.Label(main_frame, text="Base Clock (GHz):").grid(row=6, column=0, sticky=tk.W, pady=8)
        self.base_clock_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.base_clock_var, width=15).grid(row=6, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Boost Clock
        ttk.Label(main_frame, text="Boost Clock (GHz):").grid(row=6, column=2, sticky=tk.W, pady=8)
        self.boost_clock_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.boost_clock_var, width=15).grid(row=6, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # L1 Cache
        ttk.Label(main_frame, text="L1 Cache (KB):").grid(row=7, column=0, sticky=tk.W, pady=8)
        self.l1_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.l1_var, width=15).grid(row=7, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # L2 Cache
        ttk.Label(main_frame, text="L2 Cache (MB):").grid(row=7, column=2, sticky=tk.W, pady=8)
        self.l2_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.l2_var, width=15).grid(row=7, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # L3 Cache
        ttk.Label(main_frame, text="L3 Cache (MB):").grid(row=8, column=0, sticky=tk.W, pady=8)
        self.l3_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.l3_var, width=15).grid(row=8, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # TDP
        ttk.Label(main_frame, text="TDP (W):").grid(row=8, column=2, sticky=tk.W, pady=8)
        self.tdp_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.tdp_var, width=15).grid(row=8, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Graphics
        ttk.Label(main_frame, text="Graphics:").grid(row=9, column=0, sticky=tk.W, pady=8)
        self.graphics_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.graphics_var, values=self.GRAPHICS, state="readonly", width=15).grid(row=9, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Image Path
        ttk.Label(main_frame, text="Image File:").grid(row=9, column=2, sticky=tk.W, pady=8)
        self.image_path_var = tk.StringVar()
        self.image_path_var.set("No file selected")
        ttk.Label(main_frame, textvariable=self.image_path_var, foreground="blue").grid(row=9, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # File Browse Button
        ttk.Button(main_frame, text="Choose Image", command=self.browse_image).grid(row=10, column=0, columnspan=2, pady=10)
        
        # Generated Path
        ttk.Label(main_frame, text="Generated Path:").grid(row=10, column=2, sticky=tk.W, pady=8)
        self.generated_path_var = tk.StringVar()
        self.generated_path_var.set("Select an image file")
        ttk.Label(main_frame, textvariable=self.generated_path_var, foreground="green", wraplength=300).grid(row=10, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=11, column=0, columnspan=4, pady=20)
        
        ttk.Button(button_frame, text="Add CPU", command=self.add_cpu).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Clear", command=self.clear_form).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="View CPUs", command=self.view_cpus).pack(side=tk.LEFT, padx=5)
        
        # Status
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        ttk.Label(main_frame, textvariable=self.status_var, foreground="gray").grid(row=12, column=0, columnspan=4, pady=10)

    def browse_image(self):
        file_path = filedialog.askopenfilename(
            title="Select CPU Image",
            filetypes=[("Image files", "*.png *.jpg *.jpeg"), ("All files", "*.*")]
        )
        if file_path:
            # Calculate relative path from cpus.json location to the selected image
            cpus_json_dir = Path(__file__).parent
            image_path = Path(file_path)
            try:
                relative_path = image_path.relative_to(cpus_json_dir)
                # Convert to forward slashes for consistency and add leading slash
                self.selected_filename = "/" + str(relative_path).replace("\\", "/")
                self.image_path_var.set(self.selected_filename)
                self.update_generated_path()
            except ValueError:
                messagebox.showerror("Error", "Image must be within the data directory or its subdirectories.")
                self.selected_filename = ""
                self.image_path_var.set("No file selected")

    def update_generated_path(self):
        if self.selected_filename:
            self.generated_path_var.set(self.selected_filename)
        else:
            self.generated_path_var.set("Select an image file")

    def check_duplicate_cpu(self):
        cpu_name = self.name_var.get().lower()
        cpus_file = Path(__file__).parent / "cpus.json"
        
        if not cpu_name:
            self.duplicate_status_var.set("")
            return
        
        if cpus_file.exists():
            with open(cpus_file, 'r') as f:
                cpus = json.load(f)
            
            for cpu in cpus:
                if cpu["name"].lower() == cpu_name:
                    self.duplicate_status_var.set("repeat cpu")
                    return
        
        self.duplicate_status_var.set("")

    def add_cpu(self):
        if not self.validate_form():
            return
        
        cpu_data = {
            "name": self.name_var.get(),
            "socket": self.socket_var.get(),
            "microarchitecture": self.microarch_var.get(),
            "cores": int(self.cores_var.get()),
            "threads": int(self.threads_var.get()),
            "baseClock": self.base_clock_var.get(),
            "boostClock": self.boost_clock_var.get(),
            "tdp": self.tdp_var.get(),
            "l1Cache": self.l1_var.get(),
            "l2Cache": self.l2_var.get(),
            "l3Cache": self.l3_var.get(),
            "manufacturer": self.manufacturer_var.get(),
            "graphics": self.graphics_var.get(),
            "image": self.generated_path_var.get()
        }
        
        # Load existing CPUs - cpus.json is in the same directory as this script
        cpus_file = Path(__file__).parent / "cpus.json"
        if cpus_file.exists():
            with open(cpus_file, 'r') as f:
                cpus = json.load(f)
        else:
            cpus = []
        
        # Check if CPU with same name already exists
        existing_cpu_index = None
        for i, cpu in enumerate(cpus):
            if cpu["name"].lower() == cpu_data["name"].lower():
                existing_cpu_index = i
                break
        
        if existing_cpu_index is not None:
            # Ask user if they want to replace
            response = messagebox.askyesno(
                "Duplicate CPU",
                f"A CPU named '{cpu_data['name']}' already exists.\n\nDo you want to replace it with the new information?"
            )
            if response:
                cpus[existing_cpu_index] = cpu_data
            else:
                return
        else:
            cpus.append(cpu_data)
        
        # Save CPUs
        with open(cpus_file, 'w') as f:
            json.dump(cpus, f, indent=2)
        
        messagebox.showinfo("Success", f"CPU '{cpu_data['name']}' added successfully!")
        self.clear_partial_form()
        self.load_cpus()

    def clear_partial_form(self):
        # Keep manufacturer, microarchitecture, and graphics
        # Clear only the specific CPU fields
        self.name_var.set("")
        self.cores_var.set("")
        self.threads_var.set("")
        self.base_clock_var.set("")
        self.boost_clock_var.set("")
        self.l1_var.set("")
        self.l2_var.set("")
        self.l3_var.set("")
        self.tdp_var.set("")
        self.selected_filename = ""
        self.image_path_var.set("No file selected")
        self.duplicate_status_var.set("")
        self.update_generated_path()

    def validate_form(self):
        if not all([self.name_var.get(), self.socket_var.get(), self.cores_var.get(),
                    self.threads_var.get(), self.manufacturer_var.get(), 
                    self.selected_filename]):
            messagebox.showerror("Validation Error", "Please fill in all required fields and select an image.")
            return False
        return True

    def clear_form(self):
        self.name_var.set("")
        self.socket_var.set("")
        self.microarch_var.set("")
        self.cores_var.set("")
        self.threads_var.set("")
        self.base_clock_var.set("")
        self.boost_clock_var.set("")
        self.l1_var.set("")
        self.l2_var.set("")
        self.l3_var.set("")
        self.tdp_var.set("")
        self.manufacturer_var.set("")
        self.graphics_var.set("")
        self.selected_filename = ""
        self.image_path_var.set("No file selected")
        self.duplicate_status_var.set("")
        self.generated_path_var.set("Select an image file")

    def load_cpus(self):
        cpus_file = Path(__file__).parent / "cpus.json"
        if cpus_file.exists():
            with open(cpus_file, 'r') as f:
                cpus = json.load(f)
            self.status_var.set(f"{len(cpus)} CPUs loaded")
        else:
            self.status_var.set("cpus.json not found")

    def view_cpus(self):
        cpus_file = Path(__file__).parent / "cpus.json"
        if not cpus_file.exists():
            messagebox.showinfo("No Data", "No CPUs found.")
            return
        
        with open(cpus_file, 'r') as f:
            cpus = json.load(f)
        
        # Create new window
        view_window = tk.Toplevel(self.root)
        view_window.title("View CPUs")
        view_window.geometry("800x600")
        
        # Create text widget
        text_widget = tk.Text(view_window, wrap=tk.WORD, padx=10, pady=10)
        text_widget.pack(fill=tk.BOTH, expand=True)
        
        for cpu in cpus:
            text_widget.insert(tk.END, json.dumps(cpu, indent=2) + "\n\n")
        
        text_widget.config(state=tk.DISABLED)

if __name__ == "__main__":
    root = tk.Tk()
    app = CpuEntryApp(root)
    root.mainloop()