import java.io.*;

public class HTMLGen {
	
	public static final String TEMPLATE = "test/template.html", OUTPUT = "test-index.html", DELIMETER = "$INSERT$", SCRIPTS = "test/scripts/";

	public static void main(String[] args) {
		try {
			File template = new File(TEMPLATE);
			FileReader fr = new FileReader(template); //Read the template
			String content = "";
			char c;
			while ((c = (char) fr.read()) != (char) -1) { //Read in the content of the template
				content += c;
				System.out.println(c);
			}
			fr.close();
			String scripts = "";
			File scriptFile = new File(SCRIPTS);
			File[] allFiles = scriptFile.listFiles(); //Determine all the scripts  in here
			for (int i = 0; i < allFiles.length; i++) {
				scripts += tagOf(allFiles[i].getName());
			}
			String toWrite = content.replace(DELIMETER, scripts); //Replace the delimeter in the template with the scripts we found
			PrintWriter out = new PrintWriter(OUTPUT); //Write the completed file to OUTPUT
			out.print(toWrite);
			out.close();
			Runtime r = Runtime.getRuntime();
			try { //Execute the file with "xdg-open"
				String[] cmd = {"xdg-open", OUTPUT};
				r.exec(cmd);
			} catch (IOException e) {
				System.out.println("There was an error in running the test!");
				e.printStackTrace();
			}
		} catch (Exception e) {
		e.printStackTrace();
		}
	}

	public static String tagOf(String name) {
		return "<script src='" + SCRIPTS + name + "'></script>"; 
	}
}