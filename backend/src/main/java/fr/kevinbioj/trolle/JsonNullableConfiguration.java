package fr.kevinbioj.trolle;

import jakarta.validation.valueextraction.ExtractedValue;
import jakarta.validation.valueextraction.UnwrapByDefault;
import jakarta.validation.valueextraction.ValueExtractor;
import org.openapitools.jackson.nullable.JsonNullable;
import org.openapitools.jackson.nullable.JsonNullableModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Component
@Configuration
@UnwrapByDefault
public class JsonNullableConfiguration extends LocalValidatorFactoryBean {

    @Bean
    public JsonNullableModule jsonNullableModule() {
        return new JsonNullableModule();
    }

    @Override
    protected void postProcessConfiguration(jakarta.validation.Configuration<?> configuration) {
        super.postProcessConfiguration(configuration);
        configuration.addValueExtractor(new JsonNullableValueExtractor());
    }

    // ---

    private static class JsonNullableValueExtractor implements ValueExtractor<JsonNullable<@ExtractedValue ?>> {

        @Override
        public void extractValues(JsonNullable<?> originalValue, ValueReceiver receiver) {
            if (originalValue.isPresent()) {
                receiver.value(null, originalValue.get());
            }
        }
    }
}