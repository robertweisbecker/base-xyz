export type UserOption = {
	email: string;
	id: string;
	initials: string;
	name: string;
};

export const userOptions: UserOption[] = [
	{ email: "alexandria.montgomery@northstar.example", id: "alexandria-montgomery", initials: "AM", name: "Alexandria Montgomery" },
	{ email: "jamal.reed@papertrail.example", id: "jamal-reed", initials: "JR", name: "Jamal Reed" },
	{ email: "mei.lin@cedar.example", id: "mei-lin", initials: "ML", name: "Mei Lin" },
	{ email: "mateo.silva@lumen.example", id: "mateo-silva", initials: "MS", name: "Mateo Silva" },
	{ email: "priya.shah@fieldwork.example", id: "priya-shah", initials: "PS", name: "Priya Shah" },
	{ email: "soren.fischer@atlas.example", id: "soren-fischer", initials: "SF", name: "Soren Fischer" },
];

export const userSelectItems = userOptions.map((user) => ({ label: user.name, value: user }));
