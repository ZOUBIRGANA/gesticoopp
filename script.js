
const offres = [
    {
        company: "Ubisoft Montréal",
        title: "Développeur junior",
        program: "Informatique",
        location: "Montréal, QC",
        start: "2025-09-02",
        end: "2026-04-24",
        status: "Ouvert"
    },
    {
        company: "CAE Inc.",
        title: "Analyste de données",
        program: "Informatique",
        location: "Québec, QC",
        start: "2025-09-08",
        end: "2026-04-24",
        status: "Ouvert"
    },
    {
        company: "Bell Canada",
        title: "Intégrateur réseau",
        program: "Informatique",
        location: "Toronto, ON",
        start: "2025-01-01",
        end: "2025-04-18",
        status: "En évaluation"
    },
    {
        company: "Desjardins",
        title: "Développeur C#",
        program: "Informatique",
        location: "Lévis, QC",
        start: "2024-09-01",
        end: "2024-12-20",
        status: "Expiré"
    },
    {
        company: "Hydro-Québec",
        title: "Technicien TI",
        program: "Réseautique",
        location: "Montréal, QC (hybride)",
        start: "2025-09-02",
        end: "2026-04-24",
        status: "Ouvert"
    }
];

const form = document.getElementById("offerForm");
const offersBody = document.getElementById("offersBody");
const search = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");
const description = document.getElementById("description");
const counter = document.getElementById("counter");
const message = document.getElementById("formMessage");

let editingIndex = null;

// Échapper le texte avant de l'insérer dans le tableau
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Afficher la liste des offres
function afficherOffres() {
    const recherche = search.value.trim().toLocaleLowerCase("fr");
    const statutChoisi = statusFilter.value;

    const resultats = offres
        .map((offre, index) => ({ ...offre, index }))
        .filter(offre => {
            const correspondStatut =
                !statutChoisi || offre.status === statutChoisi;

            const correspondRecherche = Object.values(offre)
                .some(valeur =>
                    String(valeur)
                        .toLocaleLowerCase("fr")
                        .includes(recherche)
                );

            return correspondStatut && correspondRecherche;
        });

    offersBody.innerHTML = "";

    resultats.forEach(offre => {
        const ligne = document.createElement("tr");

        const classeStatut = offre.status
            .toLowerCase()
            .replaceAll(" ", "-");

        ligne.innerHTML = `
            <td>${escapeHTML(offre.company)}</td>
            <td>${escapeHTML(offre.title)}</td>
            <td>${escapeHTML(offre.program)}</td>
            <td>${escapeHTML(offre.location)}</td>
            <td>${escapeHTML(offre.start)}</td>
            <td>${escapeHTML(offre.end)}</td>
            <td>
                <span class="status status-${classeStatut}">
                    ${escapeHTML(offre.status)}
                </span>
            </td>
            <td>
                <button class="action-link"
                    data-edit="${offre.index}">
                    Modifier
                </button>
                <span class="action-separator">·</span>
                <button class="action-link delete-link"
                    data-delete="${offre.index}">
                    Supprimer
                </button>
            </td>
        `;

        offersBody.appendChild(ligne);
    });

    document.getElementById("resultCount").textContent =
        `${resultats.length} offre(s) affichée(s) sur ${offres.length}`;
}

// Compteur de caractères
description.addEventListener("input", () => {
    counter.textContent = `${description.value.length} / 1000`;
});

// Recherche et filtre
search.addEventListener("input", afficherOffres);
statusFilter.addEventListener("change", afficherOffres);

// Réinitialisation du formulaire
form.addEventListener("reset", () => {
    editingIndex = null;
    message.textContent = "";

    setTimeout(() => {
        counter.textContent = "0 / 1000";
    }, 0);
});

// Publier ou modifier une offre
form.addEventListener("submit", event => {
    event.preventDefault();

    const dateDebut = document.getElementById("start").value;
    const dateFin = document.getElementById("end").value;

    if (dateFin < dateDebut) {
        message.style.color = "#b42332";
        message.textContent =
            "La date de fin doit être postérieure ou égale à la date de début.";
        return;
    }

    const offre = {
        company: document.getElementById("company").value,
        title: document.getElementById("title").value.trim(),
        program: document.getElementById("program").value,
        location: document.getElementById("location").value.trim(),
        start: dateDebut,
        end: dateFin,
        status: document.getElementById("status").value
    };

    if (
        !offre.company ||
        !offre.title ||
        !offre.program ||
        !offre.location ||
        !description.value.trim()
    ) {
        message.style.color = "#b42332";
        message.textContent = "Veuillez remplir tous les champs obligatoires.";
        return;
    }

    if (editingIndex === null) {
        offres.unshift(offre);
        message.style.color = "#177245";
        message.textContent = "L'offre a été publiée avec succès.";
    } else {
        offres[editingIndex] = offre;
        editingIndex = null;
        message.style.color = "#177245";
        message.textContent = "L'offre a été modifiée avec succès.";
    }

    form.reset();
    description.value = "";
    counter.textContent = "0 / 1000";

    afficherOffres();
});

// Modifier ou supprimer une offre
offersBody.addEventListener("click", event => {
    const boutonModifier = event.target.closest("[data-edit]");
    const boutonSupprimer = event.target.closest("[data-delete]");

    if (boutonSupprimer) {
        const index = Number(boutonSupprimer.dataset.delete);

        if (confirm(`Supprimer l'offre « ${offres[index].title} » ?`)) {
            offres.splice(index, 1);
            afficherOffres();
        }
    }

    if (boutonModifier) {
        const index = Number(boutonModifier.dataset.edit);
        const offre = offres[index];

        editingIndex = index;

        document.getElementById("company").value = offre.company;
        document.getElementById("program").value = offre.program;
        document.getElementById("title").value = offre.title;
        document.getElementById("location").value = offre.location;
        document.getElementById("start").value = offre.start;
        document.getElementById("end").value = offre.end;
        document.getElementById("status").value = offre.status;

        description.value = "";
        counter.textContent = "0 / 1000";

        message.style.color = "#315dff";
        message.textContent =
            "Modifiez les champs puis cliquez sur « Publier l'offre ».";

        document.querySelector(".main").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});

// Navigation du menu latéral
document.querySelectorAll(".sidebar nav a").forEach(lien => {
    lien.addEventListener("click", event => {
        event.preventDefault();

        document.querySelectorAll(".sidebar nav a")
            .forEach(element => element.classList.remove("active"));

        lien.classList.add("active");

        const page = lien.dataset.page;
        document.querySelector(".page-heading h1").textContent = page;

        document.querySelector(".page-heading p").textContent =
            page === "Offres de stage"
                ? "Publier une nouvelle offre et consulter la liste des offres existantes"
                : "Section en cours de développement.";
    });
});

// Initialisation
afficherOffres();
