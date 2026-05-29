export interface CatalogItemApiDto {
  id?: string | null;
  code: string;
  name: string;
  description?: string | null;
  active: boolean;
}

export interface CatalogItem {
  id?: string | null;
  code: string;
  name: string;
  description?: string | null;
  active: boolean;
}

export function mapCatalogItemFromApi(dto: CatalogItemApiDto): CatalogItem {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description,
    active: dto.active,
  };
}
