###     Audio Joiner        ###
###     github@tine1117     ###

import os
import sys
from pydub import AudioSegment
from pydub.playback import play
from tqdm import tqdm


def AudioJoin(dir_path, audio_save_name, empty_time):
    audio_files = [f for f in os.listdir(dir_path) if f.endswith('.wav')]
    #print(audio_files)
    if not audio_files: 
        print("No .wav files found in the directory")
        return
    first_audio = AudioSegment.from_wav(os.path.join(dir_path, audio_files[0]))

    for file in tqdm(audio_files[1:], desc="Joiner Audio Files", unit="file"):
        audio = AudioSegment.from_wav(os.path.join(dir_path, file))

        audio_empty = AudioSegment.silent(duration=int(empty_time))

        first_audio += audio_empty + audio

    first_audio.export((audio_save_name + '.wav'), format="wav")
    print(f"Audio successfully saved as {audio_save_name}.wav")

def check_directory_exists(dir_path):
    return os.path.isdir(dir_path)

def check_name_type(audioType):
    return isinstance(audioType, (str))

def check_emptyTime(emptyTime):
    return isinstance(emptyTime, (int, float))
def print_help():
    print("Usage : python AudioJoiner.py <audio_directory_path> <audio_save_name> <audio_empty_time>")
    print("<audio_empty_time> 1000ms")

def print_info(dir_path, audio_save_name, empty_time):
    print("="*40)
    print("[ Audio Joiner Settings ]")
    print("    GitHub : @tine1117")
    print("="*40)

    print(f"  Audio File Path      : {dir_path}")
    print(f"  Audio Save Name      : {audio_save_name}")
    print(f"  Audio Empty Time     : {empty_time} ms")
    
    print("="*40)
    print("Settings successfully loaded! Ready to join the audio.")
    print("="*40)


def main():
    if len(sys.argv) != 4:
        print_help()
        sys.exit(1)

    if not(check_directory_exists(sys.argv[1]) or check_name_type(sys.argv[2] or check_emptyTime[3])):
        print_help()
        sys.exit(1)

    dir_path = sys.argv[1]
    audio_save_name = sys.argv[2]
    empty_time = sys.argv[3]

    print_info(dir_path, audio_save_name, empty_time)
    AudioJoin(dir_path, audio_save_name, empty_time) 


if __name__ =="__main__":
    main()
