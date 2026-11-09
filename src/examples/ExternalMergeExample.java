import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class ExternalMergeExample {
    private static Integer next(BufferedReader reader) throws Exception {
        String line = reader.readLine();
        return line == null ? null : Integer.valueOf(line);
    }

    // Three distinct paths; each input is a sorted run, one integer per line.
    public static void merge(Path left, Path right, Path output) throws Exception {
        try (BufferedReader a = Files.newBufferedReader(left, StandardCharsets.UTF_8);
             BufferedReader b = Files.newBufferedReader(right, StandardCharsets.UTF_8);
             BufferedWriter out = Files.newBufferedWriter(output, StandardCharsets.UTF_8)) {
            Integer x = next(a), y = next(b);
            while (x != null || y != null) {
                int value;
                if (y == null || x != null && x <= y) { value = x; x = next(a); }
                else { value = y; y = next(b); }
                out.write(Integer.toString(value));
                out.newLine();
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Path directory = Files.createTempDirectory("dsa2-merge-");
        Path left = directory.resolve("left.txt"), right = directory.resolve("right.txt"), output = directory.resolve("output.txt");
        try {
            Files.write(left, List.of("1", "4", "7"), StandardCharsets.UTF_8);
            Files.write(right, List.of("2", "4", "8"), StandardCharsets.UTF_8);
            merge(left, right, output);
            System.out.println(Files.readAllLines(output, StandardCharsets.UTF_8));
        } finally {
            Files.deleteIfExists(left);
            Files.deleteIfExists(right);
            Files.deleteIfExists(output);
            Files.deleteIfExists(directory);
        }
    }
}
