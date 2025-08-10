// Content model for a single year (sample based on your mock-up)
window.ISRAEL_HISTORY_DATA = {
  year: 1947,
  eraTitle: "Civil War Begins",
  tagsPalette: {
    "Partition": "bg-amber-500 text-black",
    "UN": "bg-purple-500",
    "Arab Higher Committee": "bg-emerald-600",
    "Palestinian Terror": "bg-rose-600"
  },
  days: [
    {
      id: "1947-11-29",
      label: "NOV 29",
      events: [
        {
          id: "un-partition",
          title: "UN General Assembly passes its resolution on the partition of Palestine",
          tags: ["Partition","UN"],
          hero: "https://placehold.co/800x480/png?text=UN+General+Assembly",
          bullets: [
            {
              text: "Representatives voting on the partition of Palestine",
              image: "https://placehold.co/640x360/png?text=Voting+Hall"
            }
          ],
          articles: [
            {
              title: "UN General Assembly passes its resolution on the partition of Palestine",
              href: "#"
            },
            { title: "The Assembly at Lake Success", href: "#" }
          ]
        }
      ]
    },
    {
      id: "1947-11-30a",
      label: "NOV 30",
      tagBanner: "Arab Higher Committee",
      events: [
        {
          id: "ahc-protests",
          title: "Arab Higher Committee—the governing body of Palestine’s Arabs—calls for protests and a strike.",
          tags: ["Arab Higher Committee"],
          hero: "https://placehold.co/800x480/png?text=Protest+Call",
          bullets: [],
          articles: []
        }
      ]
    },
    {
      id: "1947-11-30b",
      label: "NOV 30",
      tagBanner: "Palestinian Terror",
      events: [
        {
          id: "ambush-lydda",
          title: "Palestine Arabs kill civilians in a convoy sending supplies to Jerusalem",
          subtitle:
            "Near the Lydda Airport, Arab snipers attack a Jewish bus going from Natanya to Jerusalem, killing 5 passengers (3 Women and 2 men) and injuring 7. Arab snipers shoot at buses and pedestrians in Haifa, Jerusalem and Tel Aviv. Civil war begins.",
          tags: ["Palestinian Terror"],
          hero: "https://placehold.co/800x480/png?text=Ambush",
          bullets: [
            {
              text: "Palestine Arabs kill doctors and nurses in a convoy traveling to Jerusalem",
              image: "https://placehold.co/640x360/png?text=Convoy+Attack"
            }
          ],
          articles: [
            { title: "Hadassah convoy massacre claims the lives of 34 civilians", href: "#" },
            { title: "Obituary of Dr. Haim Yassky", href: "#" }
          ]
        }
      ]
    }
  ]
};
