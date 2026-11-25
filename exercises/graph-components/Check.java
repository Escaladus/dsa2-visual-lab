import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

/** Portable JDK 11+ launcher. No third-party build tool is needed. */
public class Check {
    private static String language;

    static String text(String en, String ru, String fi) {
        if ("ru".equals(language)) return ru;
        if ("fi".equals(language)) return fi;
        return en;
    }

    public static void main(String[] args) throws Exception {
        int status = run(args);
        if (status != 0) System.exit(status);
    }

    private static int run(String[] args) throws Exception {
        language = args.length == 0 ? "en" : args[0];
        if (!java.util.Set.of("en", "ru", "fi").contains(language)) {
            System.err.println("Usage: java -Dfile.encoding=UTF-8 Check.java [en|ru|fi]");
            return 2;
        }
        Path folder = Path.of("").toAbsolutePath();
        for (String file : new String[]{"Solution.java", "GraphChecks.java", "traj.jar"}) {
            if (!Files.isRegularFile(folder.resolve(file))) {
                System.err.println(text("Missing file: ", "Не найден файл: ", "Tiedosto puuttuu: ") + file);
                System.err.println(text(
                    "Open a terminal in the extracted exercise folder and run again.",
                    "Откройте терминал в распакованной папке задания и запустите снова.",
                    "Avaa pääte puretussa tehtäväkansiossa ja suorita uudelleen."));
                return 2;
            }
        }
        var compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            System.err.println(text("Install JDK 11 or newer.", "Установите JDK 11 или новее.", "Asenna JDK 11 tai uudempi."));
            return 2;
        }
        // A fresh build prevents an old compiled solution from masking a compile error.
        Path build = Files.createTempDirectory("dsa2-components-check-");
        try {
            var diagnostics = new DiagnosticCollector<JavaFileObject>();
            boolean compiled;
            try (StandardJavaFileManager manager = compiler.getStandardFileManager(diagnostics, Locale.forLanguageTag(language), StandardCharsets.UTF_8)) {
                var sources = manager.getJavaFileObjects(folder.resolve("Solution.java").toFile(), folder.resolve("GraphChecks.java").toFile());
                compiled = compiler.getTask(null, manager, diagnostics,
                    java.util.List.of("--release", "11", "-encoding", "UTF-8", "-classpath", folder.resolve("traj.jar").toString(), "-d", build.toString()),
                    null, sources).call();
            }
            if (!compiled) {
                System.err.println(text("Compilation failed. Fix Solution.java and run the same command again.",
                    "Ошибка компиляции. Исправьте Solution.java и повторите ту же команду.",
                    "Käännös epäonnistui. Korjaa Solution.java ja suorita sama komento uudelleen."));
                for (var diagnostic : diagnostics.getDiagnostics()) {
                    if (diagnostic.getKind() == Diagnostic.Kind.ERROR) {
                        String source = diagnostic.getSource() == null ? "Java" : Path.of(diagnostic.getSource().toUri()).getFileName().toString();
                        System.err.println(source + ":" + diagnostic.getLineNumber() + ": " + diagnostic.getMessage(Locale.forLanguageTag(language)));
                    }
                }
                return 1;
            }
            String executable = Path.of(System.getProperty("java.home"), "bin", System.getProperty("os.name").startsWith("Windows") ? "java.exe" : "java").toString();
            String classpath = build + File.pathSeparator + folder.resolve("traj.jar");
            int passed = 0;
            for (int test = 0; test < 10; test++) {
                Path output = build.resolve("check-" + test + ".txt");
                Process process = new ProcessBuilder(executable, "-Xmx128m", "-Xss1m", "-Dfile.encoding=UTF-8", "-cp", classpath,
                    "GraphChecks", String.valueOf(test), language).redirectErrorStream(true).redirectOutput(output.toFile()).start();
                // Each case has a fresh JVM; stale colours/static fields cannot leak between cases.
                if (!process.waitFor(5, TimeUnit.SECONDS)) {
                    // Stop our own worker directly; process enumeration is unavailable
                    // in some restricted environments and is unnecessary for this task.
                    process.destroyForcibly();
                    process.waitFor();
                    System.out.println("[" + (test + 1) + "/10] " + text(
                        "TIME LIMIT (5 seconds). Check traversal termination and visited marks.",
                        "ЛИМИТ ВРЕМЕНИ (5 секунд). Проверьте остановку обхода и пометки посещения.",
                        "AIKARAJA (5 sekuntia). Tarkista läpikäynnin pysähtyminen ja löytämismerkinnät."));
                } else {
                    if (process.exitValue() == 0) passed++;
                    System.out.print("[" + (test + 1) + "/10] ");
                    try (var input = Files.newInputStream(output)) {
                        System.out.println(new String(input.readNBytes(8192), StandardCharsets.UTF_8).strip());
                    }
                }
            }
            System.out.println(text("Passed: ", "Пройдено: ", "Läpäisty: ") + passed + "/10");
            System.out.println(text(
                "Edit Solution.java and run the same command to check again. Every run starts fresh.",
                "Исправьте Solution.java и повторите ту же команду. Каждый запуск проверяет заново.",
                "Muokkaa Solution.java ja suorita sama komento uudelleen. Jokainen ajo alkaa alusta."));
            if (passed == 10) {
                System.out.println(text(
                    "Next: explain why each traversal forms one component, how every vertex is included once, and the time/space bounds. Tests do not prove DFS/BFS use or asymptotic complexity.",
                    "Далее: объясните, почему один обход даёт одну компоненту и каждая вершина включена один раз, оцените время и память. Проверки не доказывают использование DFS/BFS и асимптотическую сложность.",
                    "Seuraavaksi: perustele, miksi yksi läpikäynti antaa yhden komponentin ja jokainen solmu esiintyy kerran, sekä aika ja muisti. Testit eivät todista DFS:n/BFS:n käyttöä tai asymptoottista vaativuutta."));
            }
            return passed == 10 ? 0 : 1;
        } finally {
            try (var files = Files.walk(build)) {
                var iterator = files.sorted(java.util.Comparator.reverseOrder()).iterator();
                while (iterator.hasNext()) Files.deleteIfExists(iterator.next());
            }
        }
    }
}
