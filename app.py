from flask import Flask, render_template, request, jsonify
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration


app = Flask(__name__)

# Load the image captioning model
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():

    # Get the uploaded image file
    image = request.files['file']

    # Save the image to a temporary location
    image_path = "static/uploaded_image.png"
    image.save(image_path)

    # Open the image and convert to RGB
    raw_image = Image.open(image_path).convert('RGB')

    # Perform image captioning
    text = "A photograph of"
    inputs = processor(raw_image, text, return_tensors="pt")

    out = model.generate(
        **inputs,
        num_beams=4,
        num_return_sequences=4,
        do_sample=False,
        output_scores=False
    )

    captions = [processor.decode(caption, skip_special_tokens=True) for caption in out]


    return render_template('index.html', captions=captions)


if __name__ == '__main__':
    app.run(debug=True)
