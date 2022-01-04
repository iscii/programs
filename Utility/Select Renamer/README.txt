this was for renaming a folder of music downloaded from a spotify playlist using Deezloader Remix.
it removes the numbers and the extra stuff before the actual name of the song.

examples:
	"1 - NF - Real"
	-> "NF - Real"
	"125 - Kygo - This Town"
	-> "Kygo - This Town"

essentially, it finds the length of the numbers (up to 3 digits. Can increase if needed, but
not necessary in this scope) and then substr() the name of the file starting from that length + 3
(because there's a " - " before the name which takes up three spaces).