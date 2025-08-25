import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemedPageWrapper, PrimaryButton, OutlineButton, ThemedCard } from "@/components/ThemedComponents";
import { getAnnouncements, Announcement } from "@/lib/api";

// Mock data for information sections
const infoSections = [
	{
		id: "student-government",
		title: "Student Government",
		description:
			"Meet your student government representatives and learn about their roles in representing your voice at school.",
		image: "https://images.squarespace-cdn.com/content/v1/57be4dc6f5e231e5516f7e44/1605373317776-D6XRQQFN594G6IUWBECK/StudentCouncil.png",
		path: "/information/student-government",
		color: "bg-amber-100/90 border-amber-300",
		iconColor: "text-amber-700",
	},
	{
		id: "clubs",
		title: "Clubs",
		description:
			"Join one of our many academic, social, and special interest clubs.",
		image: "https://www.northnationmedia.com/wp-content/uploads/2023/10/school-clubs-1200x849.png",
		path: "/information/clubs",
		color: "bg-rose-100/90 border-rose-300",
		iconColor: "text-rose-800",
	},
];

// Icon components
const StudentGovernmentIcon = () => (
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


const ClubsIcon = () => (
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

// Get icon based on section ID
const getIcon = (sectionId: string) => {
	switch (sectionId) {
		case "student-government":
			return <StudentGovernmentIcon />;
		case "clubs":
			return <ClubsIcon />;
		default:
			return null;
	}
};

export default function Information() {
	const [, setLocation] = useLocation();
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch announcements from database
	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const fetchedAnnouncements = await getAnnouncements();
				setAnnouncements(fetchedAnnouncements);
			} catch (error) {
				console.error('Failed to fetch announcements:', error);
				// Fallback to empty array if fetch fails
				setAnnouncements([]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchAnnouncements();
	}, []);

	const handleNavigate = (path: string) => {
		setLocation(path);
	};
	const handleBackClick = () => {
		sessionStorage.setItem('internal-navigation', 'true'); // Mark as internal navigation
		setLocation("/");
	};
	return (
		<ThemedPageWrapper pageType="information">
			{/* Glassmorphism overlay with backdrop blur */}
			<div className="fixed inset-0 bg-white/10 backdrop-blur-sm -z-10"></div>			{/* Main content */}
			<div className="relative z-10 min-h-screen">
				<main className="container mx-auto px-4 py-8">
					{/* Transparent back button with title */}					<div className="flex items-center mb-8">
						<Button
							variant="ghost"
							onClick={handleBackClick}
							className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
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
							<span>Back</span>
						</Button>
						<h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
							School Information
						</h1>
					</div>

					{/* Important Announcements */}
					<h2 className="text-2xl font-bold text-white mb-6">Recent Announcements</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-400">
                <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                Loading announcements...
              </div>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement._id} 
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
                      <span className="text-sm text-gray-300">{new Date(announcement.date).toLocaleDateString()}</span>
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
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="mb-2">📢</div>
                No announcements available at this time.
              </div>
            )}
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
