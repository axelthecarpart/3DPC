import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import os
from pathlib import Path

class GpuEntryApp:
    MANUFACTURERS = ["Asrock", "Asus", "AMD", "Gigabyte", "Intel", "MSI"]
    CHIPSETMANUFACTURERS = ["nvidia", "amd", "intel"]
    CHIPSETS = {
            "nvidia": [
                    "Geforce RTX 5090", 
                    "Geforce RTX 5080", 
                    "Geforce RTX 5070 Ti", 
                    "Geforce RTX 5070", 
                    "Geforce RTX 5060 Ti", 
                    "Geforce RTX 5060"
                    ],
                "amd": [

                    ]}
    MEMORYTYPES = ["GDDR7", "GDDR6X", "GDDR6", "GDDR5", "HBM2e", "HBM2"]
    def __init__(self, root):
        self.root = root
        self.root.title("GPU Data Entry")
        self.root.geometry("1000x900")
        
        self.selected_filename = ""
        self.data = {
            "name": "",  "baseClock": "", "boostClock": "", "tdp": "", "memory": "", "memoryType": "", "manufacturer": "", "chipsetManufacturer": "", "chipset": "", "slotWidth": "", "image": ""
        }
        
        self.create_widgets()
        self.load_gpus()

    def create_widgets(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title
        title = ttk.Label(main_frame, text="GPU Data Entry", font=("Arial", 18, "bold"))
        title.grid(row=0, column=0, columnspan=4, pady=15)
        
        # Name
        ttk.Label(main_frame, text="Name:").grid(row=1, column=0, sticky=tk.W, pady=8)
        self.name_var = tk.StringVar()
        name_entry = ttk.Entry(main_frame, textvariable=self.name_var, width=50)
        name_entry.grid(row=1, column=1, columnspan=3, sticky=(tk.W, tk.E), pady=8)
        name_entry.bind("<KeyRelease>", lambda e: self.check_duplicate_gpu())
        
        # Duplicate GPU Status
        self.duplicate_status_var = tk.StringVar()
        self.duplicate_status_var.set("")
        ttk.Label(main_frame, textvariable=self.duplicate_status_var, foreground="red", font=("Arial", 10, "bold")).grid(row=2, column=1, sticky=tk.W, pady=0)
        
        # Manufacturer
        ttk.Label(main_frame, text="Manufacturer:").grid(row=3, column=0, sticky=tk.W, pady=8)
        self.manufacturer_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.manufacturer_var, values=self.MANUFACTURERS, state="readonly", width=30).grid(row=3, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Chipset
        ttk.Label(main_frame, text="Chipset:").grid(row=4, column=0, sticky=tk.W, pady=8)
        self.chipset_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.chipset_var, values=self.CHIPSETS.get("nvidia", []), state="readonly", width=30).grid(row=4, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Memory
        ttk.Label(main_frame, text="Memory (GB):").grid(row=5, column=0, sticky=tk.W, pady=8)
        self.memory_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.memory_var, width=30).grid(row=5, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Memory Type
        ttk.Label(main_frame, text="Memory Type:").grid(row=5, column=2, sticky=tk.W, pady=8)
        self.memory_type_var = tk.StringVar()
        ttk.Combobox(main_frame, textvariable=self.memory_type_var, values=self.MEMORYTYPES, state="readonly", width=30).grid(row=5, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Base Clock
        ttk.Label(main_frame, text="Base Clock (GHz):").grid(row=6, column=0, sticky=tk.W, pady=8)
        self.base_clock_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.base_clock_var, width=30).grid(row=6, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # Boost Clock
        ttk.Label(main_frame, text="Boost Clock (GHz):").grid(row=6, column=2, sticky=tk.W, pady=8)
        self.boost_clock_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.boost_clock_var, width=30).grid(row=6, column=3, sticky=(tk.W, tk.E), pady=8)
        
        # Slot Width
        ttk.Label(main_frame, text="Slot Width:").grid(row=8, column=0, sticky=tk.W, pady=8)
        self.slot_width_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.slot_width_var, width=30).grid(row=8, column=1, sticky=(tk.W, tk.E), pady=8)
        
        # TDP
        ttk.Label(main_frame, text="TDP (W):").grid(row=8, column=2, sticky=tk.W, pady=8)
        self.tdp_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.tdp_var, width=30).grid(row=8, column=3, sticky=(tk.W, tk.E), pady=8)
        
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
        
        # Buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=11, column=0, columnspan=4, pady=20)
        
        ttk.Button(button_frame, text="Add GPU", command=self.add_gpu).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Clear", command=self.clear_form).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="View GPUs", command=self.view_gpus).pack(side=tk.LEFT, padx=5)
        
        # Status
        self.status_var = tk.StringVar()
        self.status_var.set("Ready")
        ttk.Label(main_frame, textvariable=self.status_var, foreground="gray").grid(row=13, column=0, columnspan=4, pady=10)

    def browse_image(self):
        file_path = filedialog.askopenfilename(
            title="Select GPU Image",
            filetypes=[("Image files", "*.png *.jpg *.jpeg"), ("All files", "*.*")]
        )
        if file_path:
            # Calculate relative path from gpus.json location to the selected image
            gpus_json_dir = Path(__file__).parent
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

    def check_duplicate_gpu(self):
        gpu_name = self.name_var.get().lower()
        gpus_file = Path(__file__).parent / "gpus.json"
        
        if not gpu_name:
            self.duplicate_status_var.set("")
            return
        
        if gpus_file.exists():
            with open(gpus_file, 'r') as f:
                gpus = json.load(f)
            
            for gpu in gpus:
                if gpu["name"].lower() == gpu_name:
                    self.duplicate_status_var.set("repeat gpu")
                    return
        
        self.duplicate_status_var.set("")

    def add_gpu(self):
        if not self.validate_form():
            return
        
        gpu_data = {
            "name": self.name_var.get(),
            "manufacturer": self.manufacturer_var.get(),
            "chipset": self.chipset_var.get(),
            "memory": self.memory_var.get(),
            "memoryType": self.memory_type_var.get(),
            "baseClock": self.base_clock_var.get(),
            "boostClock": self.boost_clock_var.get(),
            "tdp": self.tdp_var.get(),
            "slotWidth": self.slot_width_var.get(),
            "image": self.generated_path_var.get()
        }
        
        # Load existing GPUs - gpus.json is in the same directory as this script
        gpus_file = Path(__file__).parent / "gpus.json"
        if gpus_file.exists():
            with open(gpus_file, 'r') as f:
                gpus = json.load(f)
        else:
            gpus = []
        
        # Check if GPU with same name already exists
        existing_gpu_index = None
        for i, gpu in enumerate(gpus):
            if gpu["name"].lower() == gpu_data["name"].lower():
                existing_gpu_index = i
                break
        
        if existing_gpu_index is not None:
            # Ask user if they want to replace
            response = messagebox.askyesno(
                "Duplicate GPU",
                f"A GPU named '{gpu_data['name']}' already exists.\n\nDo you want to replace it with the new information?"
            )
            if response:
                gpus[existing_gpu_index] = gpu_data
            else:
                return
        else:
            gpus.append(gpu_data)
        
        # Save GPUs
        with open(gpus_file, 'w') as f:
            json.dump(gpus, f, indent=2)
        
        messagebox.showinfo("Success", f"GPU '{gpu_data['name']}' added successfully!")
        self.clear_partial_form()
        self.load_gpus()

    def clear_partial_form(self):
        # Keep manufacturer and chipset
        # Clear only the specific GPU fields
        self.name_var.set("")
        self.memory_var.set("")
        self.memory_type_var.set("")
        self.base_clock_var.set("")
        self.boost_clock_var.set("")
        self.tdp_var.set("")
        self.slot_width_var.set("")
        self.selected_filename = ""
        self.image_path_var.set("No file selected")
        self.duplicate_status_var.set("")
        self.update_generated_path()

    def validate_form(self):
        if not all([self.name_var.get(), self.manufacturer_var.get(), self.chipset_var.get(),
                    self.memory_var.get(), self.selected_filename]):
            messagebox.showerror("Validation Error", "Please fill in all required fields and select an image.")
            return False
        return True

    def clear_form(self):
        self.name_var.set("")
        self.manufacturer_var.set("")
        self.chipset_var.set("")
        self.memory_var.set("")
        self.memory_type_var.set("")
        self.base_clock_var.set("")
        self.boost_clock_var.set("")
        self.tdp_var.set("")
        self.slot_width_var.set("")
        self.selected_filename = ""
        self.image_path_var.set("No file selected")
        self.duplicate_status_var.set("")
        self.generated_path_var.set("Select an image file")

    def load_gpus(self):
        gpus_file = Path(__file__).parent / "gpus.json"
        if gpus_file.exists():
            with open(gpus_file, 'r') as f:
                gpus = json.load(f)
            self.status_var.set(f"{len(gpus)} GPUs loaded")
        else:
            self.status_var.set("gpus.json not found")

    def view_gpus(self):
        gpus_file = Path(__file__).parent / "gpus.json"
        if not gpus_file.exists():
            messagebox.showinfo("No Data", "No GPUs found.")
            return
        
        with open(gpus_file, 'r') as f:
            self.gpus_data = json.load(f)
        
        # Track modified GPUs
        self.modified_gpus = set()
        self.current_gpu_index = None
        
        # Create new window
        self.view_window = tk.Toplevel(self.root)
        self.view_window.title("View & Edit GPUs")
        self.view_window.geometry("1200x700")
        
        # Main container
        container = ttk.Frame(self.view_window, padding="10")
        container.pack(fill=tk.BOTH, expand=True)
        
        # Left panel - GPU list
        left_frame = ttk.Frame(container)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=False, padx=(0, 10))
        
        ttk.Label(left_frame, text="GPUs:", font=("Arial", 12, "bold")).pack(pady=(0, 5))
        
        # Listbox with scrollbar
        list_frame = ttk.Frame(left_frame)
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        scrollbar = ttk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.gpu_listbox = tk.Listbox(list_frame, yscrollcommand=scrollbar.set, width=30, height=30)
        self.gpu_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.gpu_listbox.yview)
        
        # Populate listbox
        for gpu in self.gpus_data:
            self.gpu_listbox.insert(tk.END, gpu["name"])
        
        self.gpu_listbox.bind("<<ListboxSelect>>", self.on_gpu_select)
        
        # Right panel - GPU details
        right_frame = ttk.Frame(container)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        ttk.Label(right_frame, text="GPU Details:", font=("Arial", 12, "bold")).pack(pady=(0, 10))
        
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
        ttk.Button(button_frame, text="Delete GPU", command=self.delete_gpu, width=20).pack(side=tk.LEFT, padx=8, pady=5)
        ttk.Button(button_frame, text="Refresh List", command=self.refresh_gpu_list, width=20).pack(side=tk.LEFT, padx=8, pady=5)
    
    def create_edit_fields(self):
        fields = [
            ("Name", "name", False),
            ("Manufacturer", "manufacturer", True),
            ("Chipset", "chipset", True),
            ("Memory (GB)", "memory", False),
            ("Memory Type", "memoryType", True),
            ("Base Clock (GHz)", "baseClock", False),
            ("Boost Clock (GHz)", "boostClock", False),
            ("TDP (W)", "tdp", False),
            ("Slot Width", "slotWidth", False),
            ("Image Path", "image", False),
        ]
        
        for i, (label, key, is_combo) in enumerate(fields):
            ttk.Label(self.details_frame, text=f"{label}:").grid(row=i, column=0, sticky=tk.W, pady=5, padx=5)
            
            var = tk.StringVar()
            self.edit_vars[key] = var
            
            if is_combo:
                if key == "manufacturer":
                    values = self.MANUFACTURERS
                elif key == "chipset":
                    values = self.CHIPSETS.get("nvidia", []) + self.CHIPSETS.get("amd", [])
                elif key == "memoryType":
                    values = self.MEMORYTYPES
                
                combo = ttk.Combobox(self.details_frame, textvariable=var, values=values, state="readonly", width=60)
                combo.grid(row=i, column=1, sticky=(tk.W, tk.E), pady=5, padx=5)
            else:
                entry = ttk.Entry(self.details_frame, textvariable=var, width=63)
                entry.grid(row=i, column=1, sticky=(tk.W, tk.E), pady=5, padx=5)
            
            # Add trace to detect changes
            var.trace_add("write", lambda *args, k=key: self.on_field_change(k))
        
        self.details_frame.columnconfigure(1, weight=1)
    
    def on_gpu_select(self, event):
        selection = self.gpu_listbox.curselection()
        if not selection:
            return
        
        # Save current GPU data before switching
        if self.current_gpu_index is not None:
            self.store_current_gpu_data()
        
        index = selection[0]
        self.current_gpu_index = index
        gpu = self.gpus_data[index]
        
        # Temporarily disable traces to avoid marking as modified during load
        for key, var in self.edit_vars.items():
            var.trace_vdelete("w", var.trace_info()[0][1] if var.trace_info() else None)
        
        # Populate fields
        for key, var in self.edit_vars.items():
            value = gpu.get(key, "")
            var.set(str(value) if value is not None else "")
        
        # Re-enable traces
        for key, var in self.edit_vars.items():
            var.trace_add("write", lambda *args, k=key: self.on_field_change(k))
    
    def on_field_change(self, key):
        """Mark current GPU as modified when a field changes"""
        if self.current_gpu_index is not None:
            self.modified_gpus.add(self.current_gpu_index)
            self.update_modified_indicator()
    
    def store_current_gpu_data(self):
        """Store current form data to the GPU in memory"""
        if self.current_gpu_index is None:
            return
        
        gpu = self.gpus_data[self.current_gpu_index]
        for key, var in self.edit_vars.items():
            value = var.get()
            gpu[key] = value
    
    def update_modified_indicator(self):
        """Update the listbox to show which GPUs are modified"""
        # Update count label
        count = len(self.modified_gpus)
        if count > 0:
            self.modified_count_var.set(f"{count} GPU(s) with unsaved changes")
        else:
            self.modified_count_var.set("No unsaved changes")
        
        # Update listbox entries with asterisk for modified GPUs
        for i, gpu in enumerate(self.gpus_data):
            display_name = gpu["name"]
            if i in self.modified_gpus:
                display_name = "* " + display_name
            
            self.gpu_listbox.delete(i)
            self.gpu_listbox.insert(i, display_name)
    
    def save_all_changes(self):
        """Save all modified GPUs to file"""
        if not self.modified_gpus:
            messagebox.showinfo("No Changes", "No GPUs have been modified.")
            return
        
        # Store current GPU data before saving
        if self.current_gpu_index is not None:
            self.store_current_gpu_data()
        
        # Save to file
        gpus_file = Path(__file__).parent / "gpus.json"
        with open(gpus_file, 'w') as f:
            json.dump(self.gpus_data, f, indent=2)
        
        count = len(self.modified_gpus)
        self.modified_gpus.clear()
        self.update_modified_indicator()
        
        messagebox.showinfo("Success", f"{count} GPU(s) updated successfully!")
        self.load_gpus()  # Update main window status
    
    def delete_gpu(self):
        selection = self.gpu_listbox.curselection()
        if not selection:
            messagebox.showwarning("No Selection", "Please select a GPU to delete.")
            return
        
        index = selection[0]
        gpu = self.gpus_data[index]
        
        response = messagebox.askyesno(
            "Confirm Delete",
            f"Are you sure you want to delete '{gpu['name']}'?"
        )
        
        if not response:
            return
        
        # Remove from data
        del self.gpus_data[index]
        
        # Save to file
        gpus_file = Path(__file__).parent / "gpus.json"
        with open(gpus_file, 'w') as f:
            json.dump(self.gpus_data, f, indent=2)
        
        # Update listbox
        self.gpu_listbox.delete(index)
        
        # Update modified tracking
        self.modified_gpus.discard(index)
        # Adjust indices for remaining GPUs
        self.modified_gpus = {i-1 if i > index else i for i in self.modified_gpus}
        self.current_gpu_index = None
        self.update_modified_indicator()
        
        # Clear fields
        for var in self.edit_vars.values():
            var.set("")
        
        messagebox.showinfo("Success", f"GPU '{gpu['name']}' deleted successfully!")
        self.load_gpus()  # Update main window status
    
    def refresh_gpu_list(self):
        if self.modified_gpus:
            response = messagebox.askyesno(
                "Unsaved Changes",
                "You have unsaved changes. Refreshing will discard them. Continue?"
            )
            if not response:
                return
        
        gpus_file = Path(__file__).parent / "gpus.json"
        with open(gpus_file, 'r') as f:
            self.gpus_data = json.load(f)
        
        # Clear modified tracking
        self.modified_gpus.clear()
        self.current_gpu_index = None
        self.update_modified_indicator()
        
        # Clear and repopulate listbox
        self.gpu_listbox.delete(0, tk.END)
        for gpu in self.gpus_data:
            self.gpu_listbox.insert(tk.END, gpu["name"])
        
        # Clear fields
        for var in self.edit_vars.values():
            var.set("")
        
        messagebox.showinfo("Refreshed", "GPU list refreshed!")

if __name__ == "__main__":
    root = tk.Tk()
    app = GpuEntryApp(root)
    root.mainloop()