import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import os
from pathlib import Path

class CpuEntryApp:
    MANUFACTURERS = ["AMD", "Intel"]
    SOCKETS = ["AM5", "AM4", "LGA1700", "LGA1200", "LGA1151", "sTRX4", "sWRX8"]
    MICROARCHITECTURES = ["Zen 5", "Zen 4", "Zen 3", "Zen 2", "Zen+", "Zen", "Arrow Lake", "Raptor Lake Refresh", "Raptor Lake", "Alder Lake", "Rocket Lake", "Comet Lake", "Cascade Lake"]
    GRAPHICS = ["None", "AMD Radeon Graphics", "Intel UHD Graphics 770", "Intel UHD Graphics 730"]

    def __init__(self, root):
        self.root = root
        self.root.title("CPU Data Entry")
        self.root.geometry("1000x900")
        
        self.selected_filename = ""
        self.data = {
            "name": "", "socket": "", "microarchitecture": "", "cores": "",
            "threads": "", "baseClock": "", "boostClock": "", "baseTdp": "", "maxTdp": "", "maxMemory": "",
            "l1Cache": "", "l2Cache": "", "l3Cache": "", "manufacturer": "",
            "graphics": "", "image": "", "amazonLink": ""
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
        name_entry = ttk.Entry(main_frame, textvariable=self.name_var, width=50)
        name_entry.grid(row=1, column=1, columnspan=3, sticky=(tk.W, tk.E), pady=8)
        name_entry.bind("<KeyRelease>", lambda e: self.check_duplicate_cpu())
        
        # Duplicate CPU Status
        self.duplicate_status_var = tk.StringVar()
        self.duplicate_status_var.set("")
        ttk.Label(main_frame, textvariable=self.duplicate_status_var, foreground="red", font=("Arial", 10, "bold")).grid(row=2, column=1, sticky=tk.W, pady=0)
        
        # Manufacturer
        ttk.Label(main_frame, text="Manufacturer:").grid(row=3, column=0, sticky=tk.W, pady=8)
        self.manufacturer_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.manufacturer_var, values=self.MANUFACTURERS, state="readonly", width=30).grid(row=3, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Socket
        ttk.Label(main_frame, text="Socket:").grid(row=4, column=0, sticky=tk.W, pady=8)
        self.socket_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.socket_var, values=self.SOCKETS, state="readonly", width=30).grid(row=4, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Microarchitecture
        ttk.Label(main_frame, text="Microarchitecture:").grid(row=4, column=2, sticky=tk.W, pady=8)
        self.microarch_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.microarch_var, values=self.MICROARCHITECTURES, state="readonly", width=30).grid(row=4, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Cores
        ttk.Label(main_frame, text="Cores:").grid(row=5, column=0, sticky=tk.W, pady=8)
        self.cores_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.cores_var, width=30).grid(row=5, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Threads
        ttk.Label(main_frame, text="Threads:").grid(row=5, column=2, sticky=tk.W, pady=8)
        self.threads_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.threads_var, width=30).grid(row=5, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Base Clock
        ttk.Label(main_frame, text="Base Clock (GHz):").grid(row=6, column=0, sticky=tk.W, pady=8)
        self.base_clock_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.base_clock_var, width=30).grid(row=6, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Boost Clock
        ttk.Label(main_frame, text="Boost Clock (GHz):").grid(row=6, column=2, sticky=tk.W, pady=8)
        self.boost_clock_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.boost_clock_var, width=30).grid(row=6, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # L1 Cache
        ttk.Label(main_frame, text="L1 Cache (KB):").grid(row=7, column=0, sticky=tk.W, pady=8)
        self.l1_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.l1_var, width=30).grid(row=7, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # L2 Cache
        ttk.Label(main_frame, text="L2 Cache (MB):").grid(row=7, column=2, sticky=tk.W, pady=8)
        self.l2_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.l2_var, width=30).grid(row=7, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # L3 Cache
        ttk.Label(main_frame, text="L3 Cache (MB):").grid(row=8, column=0, sticky=tk.W, pady=8)
        self.l3_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.l3_var, width=30).grid(row=8, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Base TDP
        ttk.Label(main_frame, text="Base TDP (W):").grid(row=8, column=2, sticky=tk.W, pady=8)
        self.base_tdp_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.base_tdp_var, width=30).grid(row=8, column=3, sticky=(tk.W, tk.E), pady=8)

        # Max TDP
        ttk.Label(main_frame, text="Max TDP (W):").grid(row=9, column=2, sticky=tk.W, pady=8)
        self.max_tdp_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.max_tdp_var, width=30).grid(row=9, column=3, sticky=(tk.W, tk.E), pady=8)

        # Max Memory
        ttk.Label(main_frame, text="Max Memory (GB):").grid(row=9, column=0, sticky=tk.W, pady=8)
        self.max_memory_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.max_memory_var, width=30).grid(row=9, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Graphics
        ttk.Label(main_frame, text="Graphics:").grid(row=10, column=0, sticky=tk.W, pady=8)
        self.graphics_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.graphics_var, values=self.GRAPHICS, state="readonly", width=30).grid(row=10, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Image Path
        ttk.Label(main_frame, text="Image File:").grid(row=10, column=2, sticky=tk.W, pady=8)
        self.image_path_var = tk.StringVar()
        self.image_path_var.set("No file selected")
        ttk.Label(main_frame, textvariable=self.image_path_var, foreground="blue").grid(row=10, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # File Browse Button
        ttk.Button(main_frame, text="Choose Image", command=self.browse_image).grid(row=11, column=0, columnspan=2, pady=10)

        # Generated Path
        ttk.Label(main_frame, text="Generated Path:").grid(row=11, column=2, sticky=tk.W, pady=8)
        self.generated_path_var = tk.StringVar()
        self.generated_path_var.set("Select an image file")
        ttk.Label(main_frame, textvariable=self.generated_path_var, foreground="green", wraplength=300).grid(row=11, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Amazon Affiliate Link
        ttk.Label(main_frame, text="Amazon Link:").grid(row=12, column=0, sticky=tk.W, pady=8)
        self.amazon_link_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.amazon_link_var, width=50).grid(row=12, column=1, columnspan=3, sticky=(tk.W, tk.E), pady=8)
        
        # Buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=13, column=0, columnspan=4, pady=20)
        
        ttk.Button(button_frame, text="Add CPU", command=self.add_cpu).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Clear", command=self.clear_form).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="View CPUs", command=self.view_cpus).pack(side=tk.LEFT, padx=5)
        
        # Status
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        ttk.Label(main_frame, textvariable=self.status_var, foreground="gray").grid(row=14, column=0, columnspan=4, pady=10)

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
            "baseTdp": self.base_tdp_var.get(),
            "maxTdp": self.max_tdp_var.get(),
            "maxMemory": self.max_memory_var.get(),
            "l1Cache": self.l1_var.get(),
            "l2Cache": self.l2_var.get(),
            "l3Cache": self.l3_var.get(),
            "manufacturer": self.manufacturer_var.get(),
            "graphics": self.graphics_var.get(),
            "image": self.generated_path_var.get(),
            "amazonLink": self.amazon_link_var.get()
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
        self.base_tdp_var.set("")
        self.max_tdp_var.set("")
        self.max_memory_var.set("")
        self.amazon_link_var.set("")
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
        self.base_tdp_var.set("")
        self.max_tdp_var.set("")
        self.max_memory_var.set("")
        self.manufacturer_var.set("")
        self.graphics_var.set("")
        self.amazon_link_var.set("")
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
            self.cpus_data = json.load(f)
        
        # Track modified CPUs
        self.modified_cpus = set()
        self.current_cpu_index = None
        
        # Create new window
        self.view_window = tk.Toplevel(self.root)
        self.view_window.title("View & Edit CPUs")
        self.view_window.geometry("1200x700")
        
        # Main container
        container = ttk.Frame(self.view_window, padding="10")
        container.pack(fill=tk.BOTH, expand=True)
        
        # Left panel - CPU list
        left_frame = ttk.Frame(container)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=False, padx=(0, 10))
        
        ttk.Label(left_frame, text="CPUs:", font=("Arial", 12, "bold")).pack(pady=(0, 5))
        
        # Listbox with scrollbar
        list_frame = ttk.Frame(left_frame)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        scrollbar = ttk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.cpu_listbox = tk.Listbox(list_frame, yscrollcommand=scrollbar.set, width=30, height=30)
        self.cpu_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.cpu_listbox.yview)
        
        # Populate listbox
        for cpu in self.cpus_data:
            self.cpu_listbox.insert(tk.END, cpu["name"])
        
        self.cpu_listbox.bind("<<ListboxSelect>>", self.on_cpu_select)
        
        # Right panel - CPU details
        right_frame = ttk.Frame(container)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        ttk.Label(right_frame, text="CPU Details:", font=("Arial", 12, "bold")).pack(pady=(0, 10))
        
        # Scrollable details frame
        details_canvas = tk.Canvas(right_frame)
        details_scrollbar = ttk.Scrollbar(right_frame, orient="vertical", command=details_canvas.yview)
        self.details_frame = ttk.Frame(details_canvas)
        
        self.details_frame.bind(
            "<Configure>",
            lambda e: details_canvas.configure(scrollregion=details_canvas.bbox("all"))
        )
        
        details_canvas.create_window((0, 0), window=self.details_frame, anchor="nw")
        details_canvas.configure(yscrollcommand=details_scrollbar.set)
        
        details_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        details_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Create edit fields
        self.edit_vars = {}
        self.create_edit_fields()
        
        # Modified count label
        self.modified_count_var = tk.StringVar()
        self.modified_count_var.set("No unsaved changes")
        modified_label = ttk.Label(right_frame, textvariable=self.modified_count_var, foreground="orange", font=("Arial", 10, "bold"))
        modified_label.pack(pady=5)
        
        # Buttons
        button_frame = ttk.Frame(right_frame)
        button_frame.pack(pady=15, padx=10, fill=tk.X)
        
        ttk.Button(button_frame, text="Update All", command=self.save_all_changes, width=20).pack(side=tk.LEFT, padx=8, pady=5)
        ttk.Button(button_frame, text="Delete CPU", command=self.delete_cpu, width=20).pack(side=tk.LEFT, padx=8, pady=5)
        ttk.Button(button_frame, text="Refresh List", command=self.refresh_cpu_list, width=20).pack(side=tk.LEFT, padx=8, pady=5)
    
    def create_edit_fields(self):
        fields = [
            ("Name", "name", False),
            ("Manufacturer", "manufacturer", True),
            ("Socket", "socket", True),
            ("Microarchitecture", "microarchitecture", True),
            ("Cores", "cores", False),
            ("Threads", "threads", False),
            ("Base Clock (GHz)", "baseClock", False),
            ("Boost Clock (GHz)", "boostClock", False),
            ("Base TDP (W)", "baseTdp", False),
            ("Max TDP (W)", "maxTdp", False),
            ("Max Memory (GB)", "maxMemory", False),
            ("L1 Cache (KB)", "l1Cache", False),
            ("L2 Cache (MB)", "l2Cache", False),
            ("L3 Cache (MB)", "l3Cache", False),
            ("Graphics", "graphics", True),
            ("Image Path", "image", False),
            ("Amazon Link", "amazonLink", False),
        ]
        
        for i, (label, key, is_combo) in enumerate(fields):
            ttk.Label(self.details_frame, text=f"{label}:").grid(row=i, column=0, sticky=tk.W, pady=5, padx=5)
            
            var = tk.StringVar()
            self.edit_vars[key] = var
            
            if is_combo:
                if key == "manufacturer":
                    values = self.MANUFACTURERS
                elif key == "socket":
                    values = self.SOCKETS
                elif key == "microarchitecture":
                    values = self.MICROARCHITECTURES
                elif key == "graphics":
                    values = self.GRAPHICS
                
                combo = ttk.Combobox(self.details_frame, textvariable=var, values=values, state="readonly", width=60)
                combo.grid(row=i, column=1, sticky=(tk.W, tk.E), pady=5, padx=5)
            else:
                entry = ttk.Entry(self.details_frame, textvariable=var, width=63)
                entry.grid(row=i, column=1, sticky=(tk.W, tk.E), pady=5, padx=5)
            
            # Add trace to detect changes
            var.trace_add("write", lambda *args, k=key: self.on_field_change(k))
        
        self.details_frame.columnconfigure(1, weight=1)
    
    def on_cpu_select(self, event):
        selection = self.cpu_listbox.curselection()
        if not selection:
            return
        
        # Save current CPU data before switching
        if self.current_cpu_index is not None:
            self.store_current_cpu_data()
        
        index = selection[0]
        self.current_cpu_index = index
        cpu = self.cpus_data[index]
        
        # Temporarily disable traces to avoid marking as modified during load
        for key, var in self.edit_vars.items():
            var.trace_vdelete("w", var.trace_info()[0][1] if var.trace_info() else None)
        
        # Populate fields
        for key, var in self.edit_vars.items():
            value = cpu.get(key, "")
            var.set(str(value) if value is not None else "")
        
        # Re-enable traces
        for key, var in self.edit_vars.items():
            var.trace_add("write", lambda *args, k=key: self.on_field_change(k))
    
    def on_field_change(self, key):
        """Mark current CPU as modified when a field changes"""
        if self.current_cpu_index is not None:
            self.modified_cpus.add(self.current_cpu_index)
            self.update_modified_indicator()
    
    def store_current_cpu_data(self):
        """Store current form data to the CPU in memory"""
        if self.current_cpu_index is None:
            return
        
        cpu = self.cpus_data[self.current_cpu_index]
        for key, var in self.edit_vars.items():
            value = var.get()
            
            # Convert numeric fields
            if key in ["cores", "threads"]:
                try:
                    cpu[key] = int(value) if value else 0
                except ValueError:
                    cpu[key] = value
            else:
                cpu[key] = value
    
    def update_modified_indicator(self):
        """Update the listbox to show which CPUs are modified"""
        # Update count label
        count = len(self.modified_cpus)
        if count > 0:
            self.modified_count_var.set(f"{count} CPU(s) with unsaved changes")
        else:
            self.modified_count_var.set("No unsaved changes")
        
        # Update listbox entries with asterisk for modified CPUs
        for i, cpu in enumerate(self.cpus_data):
            display_name = cpu["name"]
            if i in self.modified_cpus:
                display_name = "* " + display_name
            
            self.cpu_listbox.delete(i)
            self.cpu_listbox.insert(i, display_name)
    
    def save_all_changes(self):
        """Save all modified CPUs to file"""
        if not self.modified_cpus:
            messagebox.showinfo("No Changes", "No CPUs have been modified.")
            return
        
        # Store current CPU data before saving
        if self.current_cpu_index is not None:
            self.store_current_cpu_data()
        
        # Save to file
        cpus_file = Path(__file__).parent / "cpus.json"
        with open(cpus_file, 'w') as f:
            json.dump(self.cpus_data, f, indent=2)
        
        count = len(self.modified_cpus)
        self.modified_cpus.clear()
        self.update_modified_indicator()
        
        messagebox.showinfo("Success", f"{count} CPU(s) updated successfully!")
        self.load_cpus()  # Update main window status
    
    def delete_cpu(self):
        selection = self.cpu_listbox.curselection()
        if not selection:
            messagebox.showwarning("No Selection", "Please select a CPU to delete.")
            return
        
        index = selection[0]
        cpu = self.cpus_data[index]
        
        response = messagebox.askyesno(
            "Confirm Delete",
            f"Are you sure you want to delete '{cpu['name']}'?"
        )
        
        if not response:
            return
        
        # Remove from data
        del self.cpus_data[index]
        
        # Save to file
        cpus_file = Path(__file__).parent / "cpus.json"
        with open(cpus_file, 'w') as f:
            json.dump(self.cpus_data, f, indent=2)
        
        # Update listbox
        self.cpu_listbox.delete(index)
        
        # Update modified tracking
        self.modified_cpus.discard(index)
        # Adjust indices for remaining CPUs
        self.modified_cpus = {i-1 if i > index else i for i in self.modified_cpus}
        self.current_cpu_index = None
        self.update_modified_indicator()
        
        # Clear fields
        for var in self.edit_vars.values():
            var.set("")
        
        messagebox.showinfo("Success", f"CPU '{cpu['name']}' deleted successfully!")
        self.load_cpus()  # Update main window status
    
    def refresh_cpu_list(self):
        if self.modified_cpus:
            response = messagebox.askyesno(
                "Unsaved Changes",
                "You have unsaved changes. Refreshing will discard them. Continue?"
            )
            if not response:
                return
        
        cpus_file = Path(__file__).parent / "cpus.json"
        with open(cpus_file, 'r') as f:
            self.cpus_data = json.load(f)
        
        # Clear modified tracking
        self.modified_cpus.clear()
        self.current_cpu_index = None
        self.update_modified_indicator()
        
        # Clear and repopulate listbox
        self.cpu_listbox.delete(0, tk.END)
        for cpu in self.cpus_data:
            self.cpu_listbox.insert(tk.END, cpu["name"])
        
        # Clear fields
        for var in self.edit_vars.values():
            var.set("")
        
        messagebox.showinfo("Refreshed", "CPU list refreshed!")

if __name__ == "__main__":
    root = tk.Tk()
    app = CpuEntryApp(root)
    root.mainloop()