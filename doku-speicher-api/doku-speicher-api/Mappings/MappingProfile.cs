using AutoMapper;
using doku_speicher_api.Models;
using doku_speicher_api.Models.Dto.DocumentDto;

namespace doku_speicher_api.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<DocumentCreateDto, Document>();


         
            CreateMap<DocumentUpdateDto, Document>()
                .ForMember(dest => dest.DocumentId, opt => opt.Ignore()); 

            CreateMap<Document, DocumentDto>();
            CreateMap<DocumentShareLink, DocumentShareLinkDto>();
        }
    }
}
