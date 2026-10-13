// SPDX-License-Identifier: MIT
package otea;
import java.io.*;
import java.net.URI;
import java.nio.file.*;
import java.util.zip.*;
/** Packages unmodified OpenJDK class files for compile-time symbol lookup only. */
public final class JdkSymbols {
 public static void main(String[] args) throws Exception {
  FileSystem fs=FileSystems.getFileSystem(URI.create("jrt:/"));
  try(ZipOutputStream zip=new ZipOutputStream(new FileOutputStream(args[0])); java.util.stream.Stream<Path> paths=Files.walk(fs.getPath("/modules"))) {
   java.util.Set<String> seen=new java.util.HashSet<>();
   for(Path p:(Iterable<Path>)paths::iterator){
    if(!p.toString().endsWith(".class")||p.getFileName().toString().equals("module-info.class"))continue;
    String name=p.subpath(2,p.getNameCount()).toString();if(!seen.add(name))continue;
    zip.putNextEntry(new ZipEntry(name));Files.copy(p,zip);zip.closeEntry();
   }
  }
 }
}
