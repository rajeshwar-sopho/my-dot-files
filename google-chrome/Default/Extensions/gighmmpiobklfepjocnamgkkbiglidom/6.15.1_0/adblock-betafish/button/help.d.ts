declare let cleanButtonHTML: any;
declare let cleanSegueHTML: any;
declare let cleanSectionHTML: any;
declare let segueBreadCrumb: any[];
declare let popupMenuHelpMap: {};
declare let filterUpdateError: boolean;
declare let logSent: boolean;
declare let closeKeydownHandler: any;
declare let backKeydownHandler: any;
declare let primarysectionDisplay: any;
declare let ytChannelSectionDisplay: any;
declare let twitchChannelSectionDisplay: any;
declare let disabledSiteSectionDisplay: any;
declare let pauseSubsectionDisplay: any;
declare let domainPausedSubsectionDisplay: any;
declare let allPausedSubsectionDisplay: any;
declare let allowlistedSubsectionDisplay: any;
declare function logHelpFlowResults(source: any): void;
declare let savedData: {};
declare function reset(): void;
declare function transitionTo(segueToId: any, backIconClicked: any): void;
declare function closeClickHandler(): void;
declare function backClickHandler(): void;
declare function loadHTMLSegments(): Promise<void>;
declare function postLoadInitialize(): void;
declare function showHelpSetupPage(): void;
