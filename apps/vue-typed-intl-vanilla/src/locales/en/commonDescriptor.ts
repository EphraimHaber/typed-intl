
export const commonDescriptor = {
    "date": "Now is {date, date, ::M}",
    "complexMsg": `{numPhotos, plural,
      =0 {Usted no tiene fotos.}
      =1 {Usted tiene una foto.}
      other {Usted tiene # fotos.}
    }`,
    "yesSave": "Yes Save",
    "noDontSave": "No, Don't Save",
    "linkExample": "Click on this <link>{url}</link>",
    "count": "count is {count}",
    "changeLocale": "Change Language",
    "editDescription": "Edit <code>src/App.tsx</code> and save to test HMR",
    "clickVite": "Click on the Vite and React logos to learn more",
    "pageActions": {
        "EDIT": "Edit",
        "HISTORY": "History",
        "PRINT": "Print",
        "CLONE": "Clone",
        "SCAN": "Scan",
    },
    "noSearchResultFound": "No search results found for \"{searchTerm}\". Please try again!",
    "modal": {
        "title": "{text}",
        "body": "<modalBody></modalBody>",
        "buttonConfirm": "Confirm",
        "buttonCancel": "Cancel",
    },
    "genericToast": {
        "title": "{title}",
        "message": "{message}",
    },
} as const;
