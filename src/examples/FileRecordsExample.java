import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileRecordsExample {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("dsa2-records-", ".bin");
        try {
            try (RandomAccessFile records = new RandomAccessFile(file.toFile(), "rw")) {
                records.writeInt(3);
                for (int value : new int[]{7, 14, 21}) records.writeInt(value);
                int index = 1;
                long headerBytes = Integer.BYTES;
                records.seek(headerBytes + (long) index * Integer.BYTES);
                System.out.println(records.readInt());
                System.out.println(records.length());
            }
        } finally { Files.deleteIfExists(file); }
    }
}
