package com.smarthub.smart_career_hub_backend.service;

import com.smarthub.smart_career_hub_backend.entity.Opportunity;
import com.smarthub.smart_career_hub_backend.repository.OpportunityRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OpportunityService {

    private final OpportunityRepository repository;
    private final com.smarthub.smart_career_hub_backend.repository.OffreRepository offreRepository;

    @Value("${scraping.toppportunities.url:https://toppportunities.com}")
    private String defaultScrapingUrl;

    public OpportunityService(OpportunityRepository repository,
            com.smarthub.smart_career_hub_backend.repository.OffreRepository offreRepository) {
        this.repository = repository;
        this.offreRepository = offreRepository;
    }

    public List<Opportunity> getAllOpportunities() {
        // Auto-scrape if database is empty
        if (repository.count() == 0) {
            try {
                System.out.println("No opportunities found. Auto-scraping default source...");
                scrapeToppportunities(null);
            } catch (Exception e) {
                System.err.println("Auto-scrape failed: " + e.getMessage());
            }
        }

        List<Opportunity> all = new ArrayList<>(repository.findAll());

        // Fetch internal offers from MySQL and map them to Opportunity
        try {
            List<com.smarthub.smart_career_hub_backend.entity.Offre> internalOffres = offreRepository.findAll();
            for (com.smarthub.smart_career_hub_backend.entity.Offre offre : internalOffres) {
                // Only show active offers
                if (offre.getStatut() != com.smarthub.smart_career_hub_backend.enums.StatutOffre.ACTIVE) {
                    continue;
                }

                Opportunity opp = new Opportunity();
                opp.setId("internal-" + offre.getId());
                opp.setTitle(offre.getTitre());
                opp.setCompany(offre.getRecruteur() != null
                        ? offre.getRecruteur().getPrenom() + " " + offre.getRecruteur().getNom()
                        : "Smart Career Recruiter");
                opp.setDescription(offre.getDescription());
                opp.setLocation("Remote / On-site");
                opp.setType("Internal Position");
                opp.setPostedDate(LocalDateTime.now());

                // Link to the candidate view of this job
                opp.setLink("/chercheur/jobs?id=" + (offre.getRecruteur() != null ? offre.getRecruteur().getId() : ""));

                all.add(opp);
            }
        } catch (Exception e) {
            System.err.println("Error fetching internal offers: " + e.getMessage());
        }

        return all;
    }

    public Optional<Opportunity> getOpportunityById(String id) {
        return repository.findById(id);
    }

    public Opportunity saveOpportunity(Opportunity opportunity) {
        if (opportunity.getScrapedDate() == null) {
            opportunity.setScrapedDate(LocalDateTime.now());
        }
        return repository.save(opportunity);
    }

    public List<Opportunity> searchOpportunities(String keyword) {
        return repository.findByTitleContaining(keyword);
    }

    public void deleteOpportunity(String id) {
        repository.deleteById(id);
    }

    // --- Scheduled Scrape ---
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 21600000) // Every 6 hours
    public void scheduledScrape() {
        System.out.println("Running scheduled job scrape...");
        scrapeToppportunities("default");
    }

    /**
     * Scrapes job opportunities. Defaults to WeWorkRemotely if no URL is provided.
     * 
     * @param url Optional URL to scrape. If not provided, uses WeWorkRemotely.
     * @return List of scraped and saved opportunities
     */
    public List<Opportunity> scrapeToppportunities(String url) {
        String targetUrl = url != null && !url.isEmpty() ? url : "https://weworkremotely.com/";
        System.out.println("Starting scrape request for: " + targetUrl);

        List<Opportunity> scrapedOpportunities = new ArrayList<>();
        Document doc = null;

        // "Mega Scrape" Trigger: If default URL or explicitly WWR, scrape ALL sources
        if (targetUrl.contains("weworkremotely.com") || targetUrl.equals("default")) {
            System.out.println("Wait! doing a MULTI-SITE scrape...");

            // 1. WeWorkRemotely (Deep Scrape)
            scrapedOpportunities.addAll(scrapeWeWorkRemotely());

            // 2. TanitJobs
            scrapedOpportunities.addAll(scrapeTanitJobs());

            // 3. Emploitic
            scrapedOpportunities.addAll(scrapeEmploitic());

            // 4. OptionCarriere
            scrapedOpportunities.addAll(scrapeOptionCarriere());

            // 5. Keejob
            scrapedOpportunities.addAll(scrapeKeejob());

            System.out.println("Finished MULTI-SITE scraping. Total found: " + scrapedOpportunities.size());
            return scrapedOpportunities;
        }

        // For other explicit single-site requests (via API/Custom URL)
        try {
            doc = Jsoup.connect(targetUrl)
                    .userAgent(
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                    .timeout(25000)
                    .followRedirects(true)
                    .get();
        } catch (Exception e) {
            System.err.println("Connection failed for " + targetUrl);
            addFallbackOpportunity(scrapedOpportunities, targetUrl);
            return scrapedOpportunities;
        }

        // Route to specific logic based on URL text
        if (targetUrl.contains("tanitjobs.com")) {
            scrapedOpportunities.addAll(scrapeTanitJobs(doc, targetUrl));
        } else if (targetUrl.contains("emploitic.com")) {
            scrapedOpportunities.addAll(scrapeEmploitic(doc, targetUrl));
        } else if (targetUrl.contains("keejob.com")) {
            scrapedOpportunities.addAll(scrapeKeejob(doc, targetUrl));
        } else if (targetUrl.contains("optioncarriere")) {
            scrapedOpportunities.addAll(scrapeOptionCarriere(doc, targetUrl));
        } else if (targetUrl.contains("remoteok.com")) {
            scrapedOpportunities.addAll(scrapeRemoteOK(doc, targetUrl));
        } else if (targetUrl.contains("rekrute.com")) {
            scrapedOpportunities.addAll(scrapeRekrute(doc, targetUrl));
        } else if (targetUrl.contains("indeed.com")) {
            scrapedOpportunities.addAll(scrapeIndeed(doc, targetUrl));
        } else {
            // Generic Fallback
            Elements jobs = findJobListings(doc);
            for (Element job : jobs) {
                try {
                    Opportunity opp = extractOpportunityFromElement(job, targetUrl);
                    if (isValidOpportunity(opp))
                        addIfNew(scrapedOpportunities, opp);
                } catch (Exception e) {
                }
            }
            if (scrapedOpportunities.isEmpty())
                scrapedOpportunities.addAll(extractOpportunitiesFromPageContent(doc, targetUrl));
        }

        if (scrapedOpportunities.isEmpty()) {
            addFallbackOpportunity(scrapedOpportunities, targetUrl);
        }

        return scrapedOpportunities;
    }

    // --- WeWorkRemotely Scraper ---
    private List<Opportunity> scrapeWeWorkRemotely() {
        List<Opportunity> opportunities = new ArrayList<>();
        String[] specificCategories = {
                "https://weworkremotely.com/categories/remote-full-stack-programming-jobs",
                "https://weworkremotely.com/categories/remote-front-end-programming-jobs",
                "https://weworkremotely.com/categories/remote-back-end-programming-jobs",
                "https://weworkremotely.com/categories/remote-design-jobs",
                "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs",
                "https://weworkremotely.com/categories/remote-management-and-finance-jobs",
                "https://weworkremotely.com/categories/remote-product-jobs",
                "https://weworkremotely.com/categories/remote-customer-support-jobs",
                "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs"
        };

        System.out.println("WeWorkRemotely: Starting scrape...");
        for (String categoryUrl : specificCategories) {
            try {
                Document catDoc = Jsoup.connect(categoryUrl)
                        .userAgent(
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8") // Added
                                                                                                                        // header
                        .ignoreContentType(true)
                        .ignoreHttpErrors(true)
                        .timeout(15000).get();
                Elements items = catDoc.select("section.jobs ul li:not(.view-all)");
                int count = 0;
                for (Element item : items) {
                    try {
                        String title = item.select(".title").text();
                        String company = item.select(".company").text();
                        if (title.isEmpty() || company.isEmpty())
                            continue;
                        Opportunity opp = new Opportunity();
                        opp.setTitle(title);
                        opp.setCompany(company);
                        opp.setLocation("Remote");
                        opp.setType("Full-time");
                        Element linkEl = item.selectFirst("a");
                        opp.setLink(linkEl != null ? linkEl.attr("abs:href") : "https://weworkremotely.com/");

                        String dateText = item.select(".date").text();
                        String desc = "Full-time remote role for a " + title + ".";
                        if (!dateText.isEmpty()) {
                            desc += "\n\nOriginal Post Date: " + dateText;
                        }
                        opp.setDescription(desc);

                        opp.setPostedDate(LocalDateTime.now());
                        opp.setScrapedDate(LocalDateTime.now());
                        addIfNew(opportunities, opp);
                        count++;
                    } catch (Exception e) {
                    }
                }
                System.out.println("WeWorkRemotely: Scraped " + count + " jobs from " + categoryUrl);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    // --- TanitJobs Scraper ---
    private List<Opportunity> scrapeTanitJobs() {
        System.out.println("TanitJobs: Starting deep scrape (up to 5 pages)...");
        List<Opportunity> allOps = new ArrayList<>();

        for (int i = 1; i <= 5; i++) {
            String url = (i == 1) ? "https://www.tanitjobs.com/jobs/" : "https://www.tanitjobs.com/jobs/?page=" + i;
            try {
                System.out.println("TanitJobs: Connecting to page " + i + "...");
                Document doc = Jsoup.connect(url)
                        .userAgent(
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                        .ignoreContentType(true)
                        .ignoreHttpErrors(true)
                        .timeout(20000).get();

                List<Opportunity> pageOps = scrapeTanitJobs(doc, url);
                System.out.println("TanitJobs: Page " + i + " yielded " + pageOps.size() + " jobs.");
                allOps.addAll(pageOps);
                Thread.sleep(1000);
            } catch (Exception e) {
                System.err.println("TanitJobs page " + i + " failed: " + e.getMessage());
            }
        }
        return allOps;
    }

    private List<Opportunity> scrapeTanitJobs(Document doc, String baseUrl) {
        List<Opportunity> opportunities = new ArrayList<>();
        // Maximized selectors
        Elements items = doc.select(
                "div.job-listing, tr, article, .media, .job-item, .list-group-item, div.search-result, div.job-content");

        for (Element item : items) {
            try {
                String title = extractText(item,
                        "h3, h4, .media-heading a, .job-title, a.title, strong, a[href*='/job/']");
                String company = extractText(item,
                        ".company-name, .employer, .organization-name, .company-info, span.company");
                String location = extractText(item, ".location, .geo, .work-location, span.location, .city");

                if (title == null || title.length() < 3)
                    continue;

                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                opp.setCompany(company != null ? company : "TanitJobs Partner");
                opp.setLocation(location != null ? location : "Tunisia");

                Element linkEl = item.selectFirst("a[href*='/job'], a.job-link, a.title, h4 a, a[href*='/job/']");
                String link = linkEl != null ? linkEl.attr("abs:href") : baseUrl;
                opp.setLink(link);

                String dateText = extractText(item, ".date, .time, .posted, .job-date, small.text-muted");
                String desc = "Exciting career opportunity at " + opp.getCompany() + ".";
                if (dateText != null && !dateText.isEmpty()) {
                    desc += "\n\nOriginal Post Date: " + dateText;
                }
                opp.setDescription(desc);

                opp.setPostedDate(LocalDateTime.now());
                opp.setScrapedDate(LocalDateTime.now());

                addIfNew(opportunities, opp);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    // --- Emploitic Scraper ---
    private List<Opportunity> scrapeEmploitic() {
        System.out.println("Emploitic: Starting deep scrape (up to 3 pages)...");
        List<Opportunity> allOps = new ArrayList<>();

        for (int i = 0; i < 3; i++) {
            int start = i * 20;
            String url = "https://www.emploitic.com/offres-emploi?limitstart=" + start;

            try {
                System.out.println("Emploitic: Connecting to listing " + (i + 1) + "...");
                Document doc = Jsoup.connect(url)
                        .userAgent(
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                        .ignoreContentType(true)
                        .ignoreHttpErrors(true)
                        .timeout(20000).get();

                List<Opportunity> pageOps = scrapeEmploitic(doc, url);
                System.out.println("Emploitic: Page " + (i + 1) + " yielded " + pageOps.size() + " jobs.");
                if (pageOps.isEmpty()) {
                    System.out.println("Emploitic: Page " + (i + 1) + " found 0 jobs. HTML snippet for debugging:\n"
                            + doc.html().substring(0, Math.min(doc.html().length(), 500)));
                }
                allOps.addAll(pageOps);
            } catch (Exception e) {
                System.err.println("Emploitic failed: " + e.getMessage());
            }
        }
        return allOps;
    }

    private List<Opportunity> scrapeEmploitic(Document doc, String baseUrl) {
        List<Opportunity> opportunities = new ArrayList<>();
        Elements items = doc.select("div.row-fluid, div.job-box, .job-item, .row-job, .col-md-9, .offer-item, div.row");

        for (Element item : items) {
            try {
                String title = extractText(item, "h3 a, .title a, h2 a, h5, .job-title, a[href*='/offre/']");
                String company = extractText(item, ".company-name, .employer, small.text-muted, .company-title");
                String location = extractText(item, ".wilaya, .location, .place, span.fa-map-marker, .job-location");

                if (title == null || title.length() < 3)
                    continue;

                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                opp.setCompany(company != null ? company : "Emploitic Recruiter");
                opp.setLocation(location != null ? location : "North Africa");

                Element linkEl = item.selectFirst("a[href*='/offre'], h3 a, .title a, a[href*='/offre/']");
                opp.setLink(linkEl != null ? linkEl.attr("abs:href") : baseUrl);

                opp.setLink(linkEl != null ? linkEl.attr("abs:href") : baseUrl);

                opp.setDescription("Professional position available at " + company + ".");
                opp.setScrapedDate(LocalDateTime.now());

                addIfNew(opportunities, opp);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    // --- OptionCarriere Scraper ---
    private List<Opportunity> scrapeOptionCarriere() {
        System.out.println("OptionCarriere: Starting deep scrape (up to 3 pages)...");
        List<Opportunity> allOps = new ArrayList<>();

        for (int i = 1; i <= 3; i++) {
            String url = "https://www.optioncarriere.tn/emploi-tunisie.html?p=" + i;
            try {
                System.out.println("OptionCarriere: Connecting to page " + i + "...");
                Document doc = Jsoup.connect(url)
                        .userAgent(
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                        .ignoreContentType(true)
                        .ignoreHttpErrors(true)
                        .timeout(20000).get();

                List<Opportunity> pageOps = scrapeOptionCarriere(doc, url);
                System.out.println("OptionCarriere: Page " + i + " yielded " + pageOps.size() + " jobs.");
                if (pageOps.isEmpty()) {
                    System.out.println("OptionCarriere: Page " + i + " found 0 jobs. HTML snippet for debugging:\n"
                            + doc.html().substring(0, Math.min(doc.html().length(), 500)));
                }
                allOps.addAll(pageOps);
            } catch (Exception e) {
                System.err.println("OptionCarriere failed: " + e.getMessage());
            }
        }
        return allOps;
    }

    private List<Opportunity> scrapeOptionCarriere(Document doc, String baseUrl) {
        List<Opportunity> opportunities = new ArrayList<>();
        Elements items = doc.select("ul.jobs li, article.job, li.clicky, div.job, .job, li.result");

        for (Element item : items) {
            try {
                String title = extractText(item, "h2 a, .title a, h3, a.title, h2");
                String company = extractText(item, ".company, .employer, .company-name");
                String location = extractText(item, ".location, .city, .location-name");

                if (title == null)
                    continue;

                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                opp.setCompany(company != null ? company : "OptionCarriere Recruiter");
                opp.setLocation(location != null ? location : "Tunisia");

                Element linkEl = item.selectFirst("a[href*='/emploi'], a[href*='/job'], a.title, h2 a");
                String link = linkEl != null ? linkEl.attr("abs:href") : baseUrl;
                opp.setLink(link);

                opp.setDescription("Job opening for " + title + " in Tunisia.");
                opp.setScrapedDate(LocalDateTime.now());

                addIfNew(opportunities, opp);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    // --- Keejob Scraper (New) ---
    private List<Opportunity> scrapeKeejob() {
        System.out.println("Keejob: Starting deep scrape (up to 3 pages)...");
        List<Opportunity> allOps = new ArrayList<>();

        for (int i = 1; i <= 3; i++) {
            String url = "https://www.keejob.com/offres-emploi/?page=" + i;
            try {
                System.out.println("Keejob: Connecting to page " + i + "...");
                Document doc = Jsoup.connect(url)
                        .userAgent(
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                        .timeout(20000).get();

                List<Opportunity> pageOps = scrapeKeejob(doc, url);
                System.out.println("Keejob: Page " + i + " yielded " + pageOps.size() + " jobs.");
                allOps.addAll(pageOps);
            } catch (Exception e) {
                System.err.println("Keejob failed: " + e.getMessage());
            }
        }
        return allOps;
    }

    private List<Opportunity> scrapeKeejob(Document doc, String baseUrl) {
        List<Opportunity> opportunities = new ArrayList<>();
        // Keejob usually uses block-search-result or similar
        Elements items = doc
                .select(".block_search_result, .job-item, .listing-item, li.list-group-item, div.row.listing-row");

        for (Element item : items) {
            try {
                String title = extractText(item, "h4, h3 a, .title a, a.job-title, h5");
                String company = extractText(item, ".company-name, .span-company-name, .recruiter-name");
                String location = extractText(item, ".location, .span-location, .job-location");

                if (title == null)
                    continue;

                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                opp.setCompany(company != null ? company : "Keejob Employer");
                opp.setLocation(location != null ? location : "Tunisia");

                Element linkEl = item.selectFirst("a[href*='/offres-emploi/'], h4 a, .title a");
                String link = linkEl != null ? linkEl.attr("abs:href") : baseUrl;
                opp.setLink(link);

                opp.setDescription("Tunisian job opportunity for " + title + ".");
                opp.setPostedDate(LocalDateTime.now());
                opp.setScrapedDate(LocalDateTime.now());

                addIfNew(opportunities, opp);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    // --- Other Strategies (Indeed, RemoteOK, Rekrute) and Helpers ---

    private List<Opportunity> scrapeIndeed(Document doc, String baseUrl) {
        List<Opportunity> opportunities = new ArrayList<>();
        Elements items = doc.select(".job_seen_beacon, .jobsearch-SerpJobCard, .result");
        for (Element item : items) {
            try {
                String title = extractText(item, "h2.jobTitle, .title a");
                String company = extractText(item, ".companyName, .company");
                String location = extractText(item, ".companyLocation, .location");
                if (title == null || title.isEmpty())
                    continue;
                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                opp.setCompany(company != null ? company : "Indeed Recruiter");
                opp.setLocation(location != null ? location : "Unknown");
                Element linkEl = item.selectFirst("a.jcs-JobTitle");
                String link = linkEl != null ? linkEl.attr("abs:href") : baseUrl;
                opp.setLink(link);
                opp.setDescription("Opportunity found on Indeed.");
                opp.setPostedDate(LocalDateTime.now());
                opp.setScrapedDate(LocalDateTime.now());
                addIfNew(opportunities, opp);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    private List<Opportunity> scrapeRemoteOK(Document doc, String baseUrl) {
        List<Opportunity> opportunities = new ArrayList<>();
        Elements items = doc.select("tr.job");
        for (Element item : items) {
            try {
                String title = item.select(".title h2").text();
                String company = item.select(".company h3").text();
                String location = item.select(".location").text();
                if (title.isEmpty())
                    continue;
                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                opp.setCompany(company.isEmpty() ? "Remote Employer" : company);
                opp.setLocation(location.isEmpty() ? "Remote" : location);
                opp.setLink(item.select("a.preventLink").attr("abs:href"));
                opp.setDescription("Remote " + title + " position.");
                opp.setPostedDate(LocalDateTime.now());
                opp.setScrapedDate(LocalDateTime.now());
                addIfNew(opportunities, opp);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    private List<Opportunity> scrapeRekrute(Document doc, String baseUrl) {
        List<Opportunity> opportunities = new ArrayList<>();
        Elements items = doc.select(".post, .post-container");
        for (Element item : items) {
            try {
                String title = extractText(item, "h2, h3, .titreJob");
                String company = extractText(item, ".company, .nomEntreprise");
                if (title == null)
                    continue;
                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                opp.setCompany(company != null ? company : "ReKrute Employer");
                opp.setLocation("North Africa");
                opp.setLink(item.select("a").first().attr("abs:href"));
                opp.setDescription("Professional role at " + (company != null ? company : "ReKrute") + ".");
                opp.setScrapedDate(LocalDateTime.now());
                addIfNew(opportunities, opp);
            } catch (Exception e) {
            }
        }
        return opportunities;
    }

    private String getCategoryName(String url) {
        try {
            String[] parts = url.split("/");
            String slug = parts[parts.length - 1];
            return slug.replace("remote-", "").replace("-jobs", "").replace("-", " ");
        } catch (Exception e) {
            return "General";
        }
    }

    private void addIfNew(List<Opportunity> list, Opportunity opp) {
        Optional<Opportunity> existing = repository.findAll().stream()
                .filter(o -> o.getTitle() != null && o.getTitle().equalsIgnoreCase(opp.getTitle()) &&
                        o.getCompany() != null && o.getCompany().equalsIgnoreCase(opp.getCompany()))
                .findFirst();

        if (existing.isPresent()) {
            // Update existing opportunity with better description and fresh date
            Opportunity existingOpp = existing.get();
            // Only update if the new description is not the generic fallback
            if (opp.getDescription() != null && !opp.getDescription().contains("Scraped from")) {
                existingOpp.setDescription(opp.getDescription());
            }
            existingOpp.setScrapedDate(LocalDateTime.now());
            list.add(repository.save(existingOpp));
        } else {
            list.add(repository.save(opp));
        }
    }

    private boolean isValidOpportunity(Opportunity opp) {
        return opp != null && opp.getTitle() != null && !opp.getTitle().isEmpty() &&
                opp.getCompany() != null && !opp.getCompany().isEmpty();
    }

    private Elements findJobListings(Document doc) {
        String[] selectors = {
                "div.job-listing", "article.job", ".opportunity-card", ".job-item",
                "li.job", "li.result", "div.card", "div.posting", "div.jobsearch-SerpJobCard",
                "tr.job", ".job-row", ".job-card", ".offer", ".post", ".listing",
                "[class*='job-row']", "[class*='jobS']", "[class*='listing']", "[class*='offer']"
        };
        for (String selector : selectors) {
            Elements elements = doc.select(selector);
            if (!elements.isEmpty() && elements.size() > 1) {
                return elements;
            }
        }
        return new Elements();
    }

    private Opportunity extractOpportunityFromElement(Element element, String baseUrl) {
        Opportunity opportunity = new Opportunity();
        String title = extractText(element, "h1, h2, h3, h4, .title, .job-title, a.job_title, [class*='title']");
        String company = extractText(element, ".company, .employer, .company-name, [class*='company']");
        String location = extractText(element, ".location, .place, .city, [class*='location']");
        String link = null;
        Element linkEl = element.selectFirst("a[href*='/job'], a.title, a.job-title");
        if (linkEl == null)
            linkEl = element.selectFirst("a");
        if (linkEl != null)
            link = linkEl.attr("abs:href");
        if (link == null || link.isEmpty())
            link = baseUrl;
        opportunity.setTitle(title != null ? title : "Job Opportunity");
        opportunity.setCompany(company != null ? company : "Unknown Company");
        opportunity.setLocation(location != null ? location : "Remote");
        opportunity.setLink(link);
        opportunity.setDescription("Visit the application page for full details.");
        opportunity.setPostedDate(LocalDateTime.now());
        opportunity.setScrapedDate(LocalDateTime.now());
        return opportunity;
    }

    private String extractText(Element element, String selectors) {
        if (element == null)
            return null;
        String[] selectorArray = selectors.split(",");
        for (String selector : selectorArray) {
            try {
                Element found = element.selectFirst(selector.trim());
                if (found != null && !found.text().trim().isEmpty()) {
                    return found.text().trim();
                }
            } catch (Exception e) {
            }
        }
        return null;
    }

    private LocalDateTime extractPostedDate(Element element) {
        return LocalDateTime.now(); // Simplified for generic scraping
    }

    private List<Opportunity> extractOpportunitiesFromPageContent(Document doc, String baseUrl) {
        // Generic scraping disabled to prevent low-quality mock-like data
        return new ArrayList<>();
    }

    private String getDomainName(String url) {
        try {
            java.net.URI uri = new java.net.URI(url);
            String domain = uri.getHost();
            return domain.startsWith("www.") ? domain.substring(4) : domain;
        } catch (Exception e) {
            return "External Site";
        }
    }

    private void addFallbackOpportunity(List<Opportunity> opportunities, String targetUrl) {
        // Fallback disabled to prevent mock data creation
    }
}
