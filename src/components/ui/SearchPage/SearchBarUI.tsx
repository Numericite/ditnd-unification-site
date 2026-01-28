import { fr } from "@codegouvfr/react-dsfr";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
	value?: string;
	onClick: (query: string) => void;
};

export const SearchBarUI = ({ value = "", onClick }: Props) => {
	const [search, onSearchChange] = useState(value);

	const router = useRouter();

	return (
		<div className={fr.cx("fr-grid-row")}>
			<div className={fr.cx("fr-col-12")}>
				<SearchBar
					label="Rechercher un sujet, une thématique..."
					big
					onButtonClick={() => {
						onClick(search);
						router.push(
							{
								pathname: router.pathname,
								query: {
									...router.query,
									search,
								},
							},
							undefined,
							{ shallow: true },
						);
					}}
					renderInput={({ className, id, placeholder, type }) => (
						<input
							className={className}
							id={id}
							placeholder={placeholder}
							type={type}
							value={search}
							onChange={(event) => {
								if (event.currentTarget.value === "") {
									onClick("");

									const { search, ...rest } = router.query;

									router.push(
										{
											pathname: router.pathname,
											query: rest,
										},
										undefined,
										{ shallow: true },
									);
								}

								onSearchChange(event.currentTarget.value);
							}}
						/>
					)}
				/>
			</div>
		</div>
	);
};
