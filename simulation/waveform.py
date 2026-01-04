import numpy as np
import matplotlib.pyplot as plt
from parameters import FREQUENCY

# Time axis (1 cycle = 20 ms for 50 Hz)
t = np.linspace(0, 0.04, 1000)

# RMS values
V_rms = 230          # Volts (kept constant)
I_rated = 10         # Amps at 100% load

load_percentage = 120   # try 50, 80, 100, 120
I_rms = (load_percentage / 100) * I_rated


# Peak values
V_peak = V_rms * np.sqrt(2)
I_peak = I_rms * np.sqrt(2)

# Waveforms
voltage = V_peak * np.sin(2 * np.pi * FREQUENCY * t)
current = I_peak * np.sin(2 * np.pi * FREQUENCY * t)

# Plot
plt.figure()
plt.plot(t, voltage, label="Voltage (V)")
plt.plot(t, current, label="Current (A)")
plt.xlabel("Time (seconds)")
plt.ylabel("Amplitude")
plt.title("Transformer Secondary Voltage & Current (50 Hz)")
plt.legend()
plt.grid(True)
plt.show()
