import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemedPageWrapper, PrimaryButton, OutlineButton, ThemedCard } from "@/components/ThemedComponents";
import schoolVideo from "../../../../attached_assets/school2.mp4";

// Mock data for information sections
const infoSections = [
	{
		id: "representatives",
		title: "Student Representatives",
		description:
			"Meet the students who represent our school in various capacities and committees.",
		image: "https://images.squarespace-cdn.com/content/v1/57be4dc6f5e231e5516f7e44/1605373317776-D6XRQQFN594G6IUWBECK/StudentCouncil.png",
		path: "/information/representatives",
		color: "bg-blue-100/90 border-blue-300",
		iconColor: "text-blue-800",
	},
	{
		id: "elections",
		title: "Elections",
		description:
			"Information about upcoming elections, candidate requirements, and how to run for student office.",
		image: "https://sapro.moderncampus.com/hubfs/Destiny/Imported_Blog_Media/VOTEBOX-4.png",
		path: "/information/elections",
		color: "bg-amber-100/90 border-amber-300",
		iconColor: "text-amber-700",
	},
	{
		id: "seniors",
		title: "Seniors",
		description:
			"Senior-specific information including graduation events, senior activities, and important deadlines.",
		image: "https://m.media-amazon.com/images/I/61AOqbAHirL.jpg",
		path: "/information/seniors",
		color: "bg-emerald-100/90 border-emerald-300",
		iconColor: "text-emerald-800",
	},
	{
		id: "organizations",
		title: "Organizations",
		description:
			"Explore our school's clubs, sports teams, and other student organizations.",
		image: "https://www.northnationmedia.com/wp-content/uploads/2023/10/school-clubs-1200x849.png",
		path: "/information/organizations",
		color: "bg-purple-100/90 border-purple-300",
		iconColor: "text-purple-800",
	},
	{
		id: "calendar",
		title: "Calendar",
		description:
			"Stay up to date with all school events, holidays, and important academic dates.",
		image: "https://cdn.vectorstock.com/i/1000v/32/72/desc-calendar-cartoon-style-design-isolated-vector-36183272.jpg",
		path: "/information/calendar",
		color: "bg-rose-100/90 border-rose-300",
		iconColor: "text-rose-800",
	},
];

// Mock data for announcements
const announcements = [
	{
		id: 1,
		title: "New Student Council Members Announced",
		date: "May 28, 2025",
		content:
			"Congratulations to our newly elected student council members! The results are now available on the Representatives page.",
		priority: "high",
	},
	{
		id: 2,
		title: "Senior Cap and Gown Distribution",
		date: "May 15, 2025",
		content:
			"Seniors can pick up their caps and gowns from the main office between June 1-3. See the Seniors page for more details.",
		priority: "medium",
	},
	{
		id: 3,
		title: "Club Registration for Fall 2025",
		date: "May 10, 2025",
		content:
			"Registration for fall clubs opens on June 15. See the Organizations page for details on how to start or join a club.",
		priority: "medium",
	},
	{
		id: 4,
		title: "Calendar Updates for Final Exam Week",
		date: "May 5, 2025",
		content:
			"The final exam schedule has been updated. Please check the Calendar page for the most current information.",
		priority: "low",
	},
];

// Icon components
const RepresentativesIcon = () => (
	<svg
		className="h-6 w-6"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
		/>
	</svg>
);

const ElectionsIcon = () => (
	<svg
		className="h-6 w-6"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

const SeniorsIcon = () => (
	<svg
		className="h-6 w-6"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
		/>
	</svg>
);

const OrganizationsIcon = () => (
	<svg
		className="h-6 w-6"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
		/>
	</svg>
);

const CalendarIcon = () => (
	<svg
		className="h-6 w-6"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
);

// Get icon based on section ID
const getIcon = (sectionId: string) => {
	switch (sectionId) {
		case "representatives":
			return <RepresentativesIcon />;
		case "elections":
			return <ElectionsIcon />;
		case "seniors":
			return <SeniorsIcon />;
		case "organizations":
			return <OrganizationsIcon />;
		case "calendar":
			return <CalendarIcon />;
		default:
			return null;
	}
};

export default function Information() {
	const [, setLocation] = useLocation();

	const handleNavigate = (path: string) => {
		setLocation(path);
	};
	const handleBackClick = () => {
		sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
		setLocation("/");
	};
	return (
		<ThemedPageWrapper pageType="information">
			{/* Background Video */}
			<div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
				<video
					autoPlay
					muted
					loop
					playsInline
					className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
				>
					<source src={schoolVideo} type="video/mp4" />
				</video>
			</div>

			{/* Overlay to darken the background video */}
			<div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>			{/* Main content */}
			<div className="relative z-10 min-h-screen">
				<main className="container mx-auto px-4 py-8">
					{/* Transparent back button with title */}
					<div className="flex items-center mb-8">
						<Button
							variant="ghost"
							onClick={handleBackClick}
							className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</Button>
						<h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
							School Information
						</h1>
					</div>

										{/* Important Announcements */}
					<h2 className="text-2xl font-bold text-white mb-6">Recent Announcements</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className={`p-4 rounded-lg border ${
                    announcement.priority === 'high' 
                      ? 'border-red-400/50 bg-red-500/20' 
                      : announcement.priority === 'medium'
                      ? 'border-amber-400/50 bg-amber-500/20'
                      : 'border-blue-400/50 bg-blue-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-white">{announcement.title}</h3>
                    <span className="text-sm text-gray-300">{announcement.date}</span>
                  </div>
                  <p className="text-sm mt-2 text-gray-200">{announcement.content}</p>
                  {announcement.priority === 'high' && (
                    <div className="mt-2 flex items-center text-red-400 text-sm">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Important Announcement
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
		  <br></br>

					{/* Information Sections */}
					<div className="mb-12">
						<h2 className="text-2xl font-bold text-white mb-6">
							Explore School Information
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">							{infoSections.map((section) => (
								<ThemedCard
									key={section.id}
									className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-2xl transition-transform hover:scale-[1.01] cursor-pointer`}
									onClick={() => handleNavigate(section.path)}
								>
									<CardHeader className="relative pb-2">
										<div
											className={`absolute top-4 right-4 ${section.iconColor} bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full p-2`}
										>
											{getIcon(section.id)}
										</div>
										<CardTitle className="text-lg">
											{section.title}
										</CardTitle>
										<CardDescription>
											{section.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="h-40 w-full bg-gray-800 rounded-md overflow-hidden">
											<img
												src={section.image}
												alt={section.title}
												className="w-full h-full object-cover opacity-90"
												onError={(e) => {
													e.currentTarget.src = `https://via.placeholder.com/300x200?text=${section.title}`;
												}}
											/>
										</div>
									</CardContent>
									<CardFooter>
										<PrimaryButton className="w-full">
											Explore {section.title}
										</PrimaryButton>
									</CardFooter>
								</ThemedCard>
							))}
						</div>
					</div>
				</main>
			</div>
		</ThemedPageWrapper>
	);
}
