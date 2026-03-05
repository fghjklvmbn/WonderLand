###     Audio Joiner        ###
###     github@tine1117     ###
import sys
import os
import whisper
import subprocess
import shutil
from tqdm import tqdm



def print_help():
    print("Usage : python AudioSplit.py <input_audio_path> <output_audio_path> <dataset_name>")

def check_file_exists(input_audio_path):
    return os.path.isfile(input_audio_path)

def check_dir_exists(output_audio_path):
    return os.path.isdir(output_audio_path)

def print_info(input_audio_path, output_audio_path, dataset_name):
    print("="*40)
    print("[ Audio Split Settings ]")
    print("    GitHub : @tine1117")
    print("="*40)

    print(f"  Audio File Path      : {input_audio_path}")
    print(f"  Audio Save Directory      : {output_audio_path}")
    print(f"  Audio Dataset Name     : {dataset_name}")

    print("="*40)
    print("Settings successfully loaded! Ready to split the audio.")
    print("="*40)

def SplitAudio(audio_file_path, audio_save_dir, dataset_name):
    model = whisper.load_model("small")

    result = model.transcribe(audio_file_path, verbose=True)

    output_save_path = audio_save_dir + "\\" + dataset_name
    os.makedirs(output_save_path + "/wavs", exist_ok=True)
    
    for i, r in enumerate(result['segments']):
        start = r["start"]
        end = r["end"]
        output_path = f"{output_save_path}/wavs/audio{i+1}.wav"

        command = [
            "ffmpeg", 
            "-y", #출력 파일 존재시 강제로 덮어쓴다.
            "-i", audio_file_path,
            "-ss", str(start), #starting position
            "-to", str(end), 
            "-hide_banner",
            "-loglevel", "error", #error 화면만 출력력
            output_path
        ]
        subprocess.run(command)

    with open(f"{output_save_path}/metadata.txt", "w", encoding="utf-8") as f:
        for i, r in enumerate(result['segments']):
            f.write(f"audio{i+1}|{r['text'].strip()}|{r['text'].strip()}\n")

    zip_filename = dataset_name + ".zip"
    powershell_cmd = f"Compress-Archive -Path '{output_save_path}/wavs', '{output_save_path}/metadata.txt' -DestinationPath '{output_save_path}/{zip_filename}'"
    subprocess.run(["powershell", "-Command", powershell_cmd], shell=True)

    print(f"Audio successfully saved as {output_save_path}\{zip_filename}")

def main():
    if len(sys.argv) != 4:
        print_help()
        sys.exit(1)
    if not(check_file_exists(sys.argv[1]) or check_dir_exists(sys.argv[2])):
        print_help()
        sys.exit(1)
    audio_file_path = sys.argv[1]
    audio_save_dir = sys.argv[2]
    dataset_name = sys.argv[3]

    print_info(audio_file_path, audio_save_dir, dataset_name)
    SplitAudio(audio_file_path, audio_save_dir, dataset_name)


if __name__ =="__main__":
    main()
