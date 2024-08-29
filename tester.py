import keras 
import json 
import numpy
import librosa

ent_model = keras.saving.load_model("saved_models/enthusiasim.keras")
print(ent_model)