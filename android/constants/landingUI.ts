import { MaterialCommunityIcons } from "@expo/vector-icons";
import { videos } from "./videos";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export const videoObjects = [
	{
		title: "Explore.",
		file: videos.V1
	},
	{
		title: "Connect.",
		file: videos.V1
	},
	{
		title: "Vibe.",
		file: videos.V1
	}
];

export const footerLinks: {
	name: IconName;
	title: string;
	link: string;
}[] = [
		{
			name: "github",
			title: "Github",
			link: "https://github.com/Tamoziit"
		},
		{
			name: "linkedin",
			title: "LinkedIn",
			link: "https://www.linkedin.com/in/tamojit-das-b77b62293"
		},
		{
			name: "instagram",
			title: "Instagram",
			link: "https://www.instagram.com/tamoziit18?igsh=MXJhd2E4OHBlaGs3dA=="
		},
		{
			name: "email",
			title: "Email",
			link: "mailto:tamojitdas181007@gmail.com"
		}
	];