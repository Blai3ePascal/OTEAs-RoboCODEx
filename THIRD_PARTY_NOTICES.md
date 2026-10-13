# Third-party notices

Copyrights and licenses are retained by their respective authors. The MIT license of the new application does **not** relicense third-party software, institutional marks or historical artwork.

## Original Robocode distribution

The unmodified `vendor/robocode-1.11.1-setup.jar` was provided by David Pacios Izquierdo. The build extracts its engine, API, standard robot examples, dependencies and resource files. No engine source or bundled third-party bytecode is modified. Upstream source: https://github.com/robo-code/robocode . Robocode was originally created by Mathew A. Nelson and is maintained by Flemming N. Larsen and contributors.

Robocode engine/API/modules/sample robots: Eclipse Public License 1.0. The complete license distributed in the installer is retained at `licenses/robocode-epl-v1.html`. Source is available in the upstream repository. The installer retains its original documentation and copyright headers. The new `otea.ArenaBridge` calls the public control API; it is separate MIT source.

| Included dependency | Version | License / upstream |
|---|---|---|
| Eclipse ECJ | 3.46.0 | EPL-2.0; https://github.com/eclipse-jdt/eclipse.jdt.core |
| Apache Commons BCEL | 6.12.0 | Apache-2.0; https://commons.apache.org/proper/commons-bcel/ |
| Apache Commons Lang | 3.20.0 | Apache-2.0; https://commons.apache.org/proper/commons-lang/ |
| Apache Commons IO | 2.21.0 | Apache-2.0; https://commons.apache.org/proper/commons-io/ |
| PicoContainer | 2.15.2 | BSD-3-Clause; https://github.com/picocontainer/picocontainer2 |
| Kotlin standard library | 2.4.0 | Apache-2.0; https://github.com/JetBrains/kotlin |
| JetBrains annotations | 13.0 | Apache-2.0; https://github.com/JetBrains/java-annotations |
| JNA and JNA Platform | 5.18.1 | Dual LGPL-2.1-or-later / Apache-2.0; see embedded META-INF/LICENSE and https://github.com/java-native-access/jna |
| OSGi service prefs | 1.1.2 | Apache-2.0; embedded META-INF/LICENSE/NOTICE |
| OSGi annotations | 8.0.1 | Apache-2.0; embedded META-INF/LICENSE/NOTICE |
| CodeSize | 1.3.1 | EPL-1.0, confirmed by the upstream Maven POM; copyright and original notices preserved. See https://central.sonatype.com/artifact/net.sf.robocode/codesize/1.3.1 |

`licenses/vendor/` preserves available license/notice/about files extracted from dependencies; `licenses/inventory.json` identifies JAR files by SHA-256 and maps their extracted notices. Where an upstream JAR omits a license text, supplementary upstream license copies or links are supplied. Original contents remain in the installer. Changes to EPL components, if made later, must follow their source and notice requirements. Proprietary native functionality is not required to install anything on users' computers.

## Browser runtimes

**CheerpJ 4.3** — Copyright Leaning Technologies. https://cheerpj.com/ . The loader and runtime are fetched from `https://cjrtnc.leaningtech.com/4.3/loader.js`; they are not copied to this repository. Use is subject to the CheerpJ Community License described at https://cheerpj.com/docs/licensing . This is a public FOSS application with appropriate credits. Community use is not equivalent to permission to self-host or redistribute CheerpJ. Commercial, organizational or institutional uses outside its scope must be assessed with Leaning Technologies. Open-source notices for its Java runtime: https://cheerpj.com/docs/opensource . The application does not suppress vendor licensing notices.

**Pyodide 0.27.7** — Copyright the Pyodide contributors and Mozilla; MPL-2.0 with notices for embedded components, including CPython/PSF and Emscripten. Loaded from `https://cdn.jsdelivr.net/pyodide/v0.27.7/full/` on demand. Upstream license retained at `licenses/pyodide-0.27.7-LICENSE`; source and all component notices: https://github.com/pyodide/pyodide/tree/0.27.7 . This project does not modify Pyodide or CPython.

JavaScript uses the browser's built-in engine. The visual blocks editor and canvas renderer are original source and do not include Blockly or Scratch runtime code.

## Historical images and marks

- `assets/robocode_logo.jpg`: https://www.ucm.es/robocode/file/robocode_logo?ver=n
- `assets/vectortank.jpg`: https://www.ucm.es/robocode/file/vectortank?ver=n
- `assets/robocodebrixiiucm.png`: https://www.ucm.es/robocode/file/robocodebrixiiucm?ver=n

Downloaded from the public Robocode UCM activity page on 2026-10-13. The activity organizer requested reuse of its original resources. Rights in logos, institutional marks and illustrations remain with their owners; no independent open-content license was identified. Their inclusion supplies historical context for the activity; it does not establish new sponsorship or permission to use institutional branding for unrelated projects. These files are excluded from the project's MIT grant.

`assets/mark.svg` and `assets/vanguard.svg` are new artwork licensed under MIT with the original project source.

## References without redistribution

OGame / Gameforge and Urban Rivals / Acute Games are design references only. Their artwork, code, trademarks and page copy are not included. Scratch / Scratch Foundation and MIT is an interaction reference only; no Scratch assets, editor source or logos are included. Robocode Tank Royale is a technical architecture reference (Apache-2.0 upstream); no Tank Royale server or API is redistributed by this version. RoboWiki and the Pascal microguide are linked as learning resources, not copied into the project.

Full reference URLs and attribution appear in README.md and docs/DESIGN.md.
