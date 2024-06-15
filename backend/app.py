import cv2
import time
from cap_from_youtube import cap_from_youtube
import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, jsonify, request
from flask_cors import CORS


print('debug point 1')

## Loading Model for inferencing on GPU
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
# model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base") ## non cuda
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to("cuda") ## cuda verion

## Loading Model for mapping sentences in vector space.
SentenceTransformer_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')

print('debug point 2')


app = Flask(__name__)
CORS(app, origins="http://127.0.0.1:5173")

@app.route('/process', methods=['POST'])
def process_text():
    # Extract data from the POST request
	url = request.json['url']
	prompt = request.json['prompt']

	print(url, prompt)
	cap = cap_from_youtube(url, '144p')

	# cv2.namedWindow('video', cv2.WINDOW_NORMAL)
	frameRate = cap.get(cv2.CAP_PROP_FPS)
	frameNo = frameRate
	print("fps is", frameRate)

	sentences = [] ## text outputs

	start = time.time()

	while True:
		cap.set(cv2.CAP_PROP_POS_FRAMES, frameNo) ## sets the position of frame.
		frameNo += frameRate  ## skip frames equal to frameRate. 
		frameId = cap.get(1)  ## get the frame number. 
		ret, frame = cap.read()
		if not ret:
			break
    	# print(frameId)
    	# cv2.imshow('video', frame)
		raw_image = frame
    	# unconditional image captioning
    	# start = time.time()
		# inputs = processor(raw_image, return_tensors="pt") ## non cuda
		inputs = processor(raw_image, return_tensors="pt").to("cuda")  ## cuda version

		out = model.generate(**inputs)
		text = processor.decode(out[0], skip_special_tokens=True)
		print(round(frameId / frameRate), text)
		sentences.append(text)
    	# end = time.time()
    	# print(end - start)
    
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break

	end = time.time()
	print(end - start)

	print('debug point 4')


	sentence_embeddings = SentenceTransformer_model.encode(sentences)

	user_input = [prompt]
	print(user_input)
	user_embedding = SentenceTransformer_model.encode(user_input)

	cosine_similarities = cosine_similarity(user_embedding, sentence_embeddings)

	print('debug point 5')

	cnt = 0
	timestamps = []
	for i in cosine_similarities.flatten():
		if i > 0.42 :
			timestamps.append(cnt)
		cnt = cnt + 1


	## calculating time duration.
	res = []
	start = 0
	end = 0
	if len(timestamps) > 0:
		start = timestamps[0]
		end = timestamps[0]
		for i in timestamps:
			if(i != start and i > (end + 2)):
				res.append([start, end + 1])
				start = i
				end = i
			elif (i != start):
				end = i
		res.append([start, end + 1]) 
				
	print(cosine_similarities)
	print(timestamps)
	print(res)

	# Return a JSON response
	return jsonify({
        'timestamps': res,
    })


if __name__ == '__main__':
    app.run(debug=True)

    