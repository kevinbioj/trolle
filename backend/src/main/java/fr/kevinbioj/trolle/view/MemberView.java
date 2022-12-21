package fr.kevinbioj.trolle.view;

import fr.kevinbioj.trolle.model.member.MemberEntity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record MemberView(OffsetDateTime joinedAt,
                         UserView user) {

    public static MemberView from(MemberEntity member) {
        return new MemberView(
                member.getJoinedAt().atOffset(ZoneOffset.UTC),
                UserView.from(member.getUser()));
    }
}
