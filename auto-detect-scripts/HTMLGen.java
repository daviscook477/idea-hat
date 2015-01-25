import java.io.*;

public class HTMLGen {

	public static void main(String[] args) {
		if (args.length < 3) {
			System.out.println("Command run in the form: $template $scripts $output $delimeter");
			return;
		}
		try {
			File template = new File(args[0]);
			FileReader fr = new FileReader(template); //Read the template
			String content = "";
			char c;
			while ((c = (char) fr.read()) != (char) -1) { //Read in the content of the template
				content += c;
			}
			fr.close();
			String scripts = "";
			File scriptFile = new File(args[1]);
			BufferedReader br = new BufferedReader(new FileReader(scriptFile));
			String line;
			while ((line = br.readLine()) != null) {
   				scripts += tagOf(line);
			}
			br.close();
			String toWrite = content.replace(args[3], scripts); //Replace the delimeter in the template with the scripts we found
			PrintWriter out = new PrintWriter(args[2]); //Write the completed file to OUTPUT
			System.out.println("Injecting scripts into " + args[0] + ". Output in " + args[2]);
			out.print(toWrite);
			out.close();
		} catch (Exception e) {
		e.printStackTrace();
		}
	}

	public static String tagOf(String name) {
		return "<script src='" + name + "'></script>"; 
	}
}