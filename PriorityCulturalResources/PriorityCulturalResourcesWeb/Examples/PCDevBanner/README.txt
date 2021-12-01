1. Add a reference to the HTML fragment right after the <body> tag inside the main HTML file with the following:

@Html.Partial("~/Views/Partial/DevBannerFragment.cshtml")

2. Update App_Start/BundleConfig.cs to include the css file.

Example:

bundles.Add(new Bundle("~/Content/css").Include(
               ...
                "~/Content/DevBanner.cs));

3. Update AppStart/Bundle.config to include the Javascript:

Example:

            bundles.Add(new Bundle("~/Scripts/min").Include(
                ...
                "~/Scripts/DevBanner.js"));

4. Update the setEnvironmentBanner function in DevBanner.js to match the server names in your application and add a call to this function in document ready.