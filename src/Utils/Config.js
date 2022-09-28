// Utility imports
import { nanoid } from "nanoid";
/**
 * Stores the Google Maps API key - this will need to be relocated at a later date to prevent abuse.
 * @constant {string}
 */
export const GMAP_API_KEY = "";
/**
 * Stores the base URL for the reverse geocoding API calls to Google Maps.
 * @constant {string}
 */
export const GC_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?";
/**
 * Stores the value for the ResultType query parameter in the reverse geocoding API calls. This ensure the correct parts of retrieved. Changing this *will* mangle the location that gets displayed, but this is purely aesthetic.
 * @constant {string}
 */
export const GC_RESULT_TYPE = "country|sublocality|administrative_area_level_1";
export const DEFAULT_ENTRIES = [
    {
        uuid: nanoid(),
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nibh diam, elementum sit amet lacinia ac, venenatis vel sem. In dictum nisl quam, scelerisque accumsan ex semper non. Sed aliquam vel ipsum vel pulvinar. Sed imperdiet turpis lacus, quis ultricies erat convallis nec. Praesent feugiat purus ligula, sit amet porttitor quam varius a. Nullam nec orci luctus, rhoncus ante sed, sagittis nulla. Donec commodo libero vulputate tincidunt maximus. Nam at cursus arcu, vitae finibus augue. Sed ",
        date: 1651420800000,
        tags: ["Tag 1", "Tag 2", "Tag 3"],
        location: { lat: 40.6955905624073, long: -73.92401519490903 }
    },
    {
        uuid: nanoid(),
        text: "Sed viverra diam ac sapien efficitur, scelerisque congue urna lobortis. Nullam facilisis erat id aliquam dignissim. Etiam sit amet justo convallis, aliquet lacus vitae, cursus dolor. Donec faucibus finibus mi eu posuere. Integer turpis turpis, efficitur quis odio egestas, mattis lacinia magna. Aenean bibendum quis odio blandit varius. Nulla ac nisl augue. Integer egestas, tellus non sodales finibus, libero odio pellentesque orci, scelerisque interdum est augue quis libero. ",
        date: 1651766400000,
        tags: ["Tag 4", "Tag 5"],
        location: { lat: 40.6955905624073, long: -73.92401519490903 }
    },
    {
        uuid: nanoid(),
        text: "Phasellus ut nisi eleifend, euismod neque in, vulputate erat. Quisque at bibendum justo. Integer at eros id augue lobortis imperdiet. Duis eleifend lectus vel erat pharetra, vel pulvinar justo cursus. Mauris placerat orci a mi aliquam suscipit. Maecenas massa neque, rutrum eu pulvinar eu, tempus non ex. Fusce mollis pulvinar sapien, vel porttitor est ultrices et. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. ",
        date: 1652198400000,
        tags: ["Tag 1"],
        location: { lat: 40.6955905624073, long: -73.92401519490903 }
    },
    {
        uuid: nanoid(),
        text: " Phasellus odio erat, cursus ultricies facilisis et, auctor vitae enim. Ut tincidunt orci pharetra porta varius. Aliquam erat volutpat. Aenean ac maximus orci, vel fringilla eros. Sed malesuada sollicitudin tempor. Mauris et tristique dolor, id accumsan nulla. Duis nec efficitur diam. Nulla porta suscipit faucibus. ",
        date: 1652630400000,
        tags: ["Tag 2", "Tag 3", "Tag 4"],
        location: { lat: 40.6955905624073, long: -73.92401519490903 }
    },
    {
        uuid: nanoid(),
        text: "Mauris hendrerit dictum eleifend. Mauris id nulla felis. Ut egestas sagittis ex in venenatis. Aliquam porttitor tincidunt efficitur. Pellentesque tellus elit, vehicula quis eros eu, sollicitudin facilisis arcu. Donec ultricies eu sapien at volutpat. Donec dapibus id ipsum vitae tincidunt. Mauris id velit vitae nunc sagittis gravida. Morbi suscipit justo vitae risus vestibulum iaculis a et lectus. Mauris dapibus, neque vel scelerisque vestibulum, lorem eros elementum libero, nec tempor ipsum sem ",
        date: 1653062400000,
        tags: ["Tag 5", "Tag 1"],
        location: { lat: 40.6955905624073, long: -73.92401519490903 }
    },
    {
        uuid: nanoid(),
        text: "Etiam et purus facilisis, pulvinar lacus a, sodales ex. Vestibulum at elementum ante. Fusce a diam quis risus sollicitudin dapibus ac vel odio. Integer varius metus ut ex consectetur facilisis. Phasellus sed felis lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis tempor pellentesque elementum. Nam dignissim cursus hendrerit. Donec quis tortor dapibus, ultricies felis ut, tempor ante. Donec eu sem tincidunt, aliquam mi et, consectetur nulla",
        date: 1653494400000,
        tags: ["Tag2"],
        location: { lat: 40.6955905624073, long: -73.92401519490903 }
    },
    {
        uuid: nanoid(),
        text: "Nunc at ex eu sem sollicitudin interdum nec ut nisl. Curabitur ultrices felis eu odio hendrerit lobortis. Integer id ante et sem sagittis lobortis. Integer auctor lacus non egestas laoreet. Curabitur vestibulum eros eu tortor accumsan, vitae porta ex finibus. Nulla ac massa ac risus porta posuere. Nam blandit convallis quam in fermentum. Fusce efficitur diam non varius faucibus. Vivamus lorem mauris, efficitur vitae magna gravida, lobortis dapibus erat. Suspendisse rutrum nisi quis dolor imperdi",
        date: 1653926400000,
        tags: ["Tag 3"],
        location: { lat: 40.6955905624073, long: -73.92401519490903 }
    }
];

export const ENTER_KEY_CODE = 13;
